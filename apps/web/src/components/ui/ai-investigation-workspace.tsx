'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
	Search,
	FolderGit2,
	GitBranch,
	Terminal,
	Brain,
	Cpu,
	Layers,
	Server,
	Database,
	Network,
	Activity,
	Flame,
	ShieldCheck,
	Sparkles,
	Play,
	RefreshCw,
	Sliders,
	X,
	ChevronRight,
	ChevronDown,
	Zap,
	CheckCircle2,
	Building2,
	ExternalLink,
	FileText,
	AlertCircle,
	Command,
	Code2,
	Maximize2,
	Minimize2,
	Plus,
	Send,
	Eye,
	BookOpen,
	HeartPulse,
	ArrowRight,
	Share2,
	HelpCircle,
	Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Entity Data Structure for Context Panel & Explorer
interface SoftwareEntity {
	id: string;
	name: string;
	category: 'module' | 'service' | 'package' | 'api' | 'database' | 'infrastructure' | 'configuration';
	path: string;
	healthScore: number;
	healthGrade: string;
	complexity: number;
	riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
	dependencies: string[];
	incoming: string[];
	relatedServices: string[];
	aiSummary: string;
	recentCommits: { sha: string; message: string; author: string; time: string }[];
	openIssues: { id: string; title: string; severity: string }[];
	archPosition: string;
}

// Conversation Message Structure
interface ChatMessage {
	id: string;
	sender: 'user' | 'ai';
	promptText?: string;
	timestamp: string;
	cardData?: {
		title: string;
		problemSummary: string;
		evidence: string[];
		affectedFiles: string[];
		graphNodes: { id: string; name: string; type: string; color: string }[];
		archView: string;
		riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
		confidenceScore: string;
		nextActions: string[];
		estimatedEffort?: string;
	};
}

export function AIInvestigationWorkspace() {
	// Selected Entity State for synchronized Context Panel
	const [selectedEntityId, setSelectedEntityId] = useState<string>('auth-gateway');
	const [hoveredEntityId, setHoveredEntityId] = useState<string | null>(null);

	// Command Palette Modal State
	const [isCmdKOpen, setIsCmdKOpen] = useState<boolean>(false);
	const [cmdKQuery, setCmdKQuery] = useState<string>('');

	// Architecture Focus Mode Modal State
	const [focusModeNode, setFocusModeNode] = useState<SoftwareEntity | null>(null);

	// Left Explorer Tree State
	const [treeSearch, setTreeSearch] = useState<string>('');
	const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
		modules: true,
		services: true,
		apis: true,
		databases: true,
		packages: false,
		infrastructure: false,
		configurations: false,
	});

	// Center Panel Conversation Messages
	const [chatInput, setChatInput] = useState<string>('');
	const [messages, setMessages] = useState<ChatMessage[]>([
		{
			id: 'msg-1',
			sender: 'ai',
			timestamp: 'Just now',
			cardData: {
				title: 'Initial Architecture Analysis Briefing',
				problemSummary:
					'CodeAtlas AST engine detected 3 key refactoring opportunities in AuthGateway and PaymentService. Modular cohesion is high (92/100) with isolated DB layers.',
				evidence: [
					'FastAPI router handler direct SQL query invocation in payment_router.py (Line 42)',
					'Auth JWT secret validation lock contention under >45k req/sec peak loads',
					'Deprecation warnings on Pydantic v1 BaseSettings objects during boot',
				],
				affectedFiles: [
					'app/api/v1/auth.py',
					'app/services/jwt_validator.py',
					'app/api/v1/payments.py',
					'app/db/repositories/user_repo.py',
				],
				graphNodes: [
					{ id: 'n1', name: 'AuthGatewayController', type: 'Class', color: '#38bdf8' },
					{ id: 'n2', name: 'JwtValidatorService', type: 'Service', color: '#818cf8' },
					{ id: 'n3', name: 'UserRepository', type: 'Repository', color: '#34d399' },
					{ id: 'n4', name: 'RedisCacheCluster', type: 'Database', color: '#fbbf24' },
				],
				archView: 'Modular Monolith (FastAPI + Asyncpg)',
				riskLevel: 'MEDIUM',
				confidenceScore: '96.4%',
				nextActions: [
					'Extract inline SQL queries into service handler repository functions',
					'Deploy Redis Cluster adapter for JWT token caching',
					'Migrate class Config to pydantic-settings BaseSettings',
				],
				estimatedEffort: '1.5 Days',
			},
		},
	]);

	// Pre-built Quick Prompts
	const quickPrompts = [
		'Why is Authentication slow?',
		'Find dead code.',
		'Explain PaymentService.',
		'Show circular dependencies.',
		'Which modules are tightly coupled?',
		'Where is technical debt growing?',
		'Predict deployment risks.',
		'Which APIs are unused?',
		'Which service should I refactor first?',
		'Explain this architecture.',
		'Suggest performance improvements.',
	];

	// Master Catalog of Software Entities for Synchronized Exploration
	const entityCatalog: Record<string, SoftwareEntity> = {
		'auth-gateway': {
			id: 'auth-gateway',
			name: 'AuthGatewayController',
			category: 'service',
			path: 'apps/backend/app/api/v1/auth.py',
			healthScore: 94.0,
			healthGrade: 'Grade A+',
			complexity: 8.2,
			riskLevel: 'LOW',
			dependencies: ['JwtValidatorService', 'UserRepository', 'RedisCacheCluster'],
			incoming: ['RouterProxy', 'SecurityMiddleware', 'ApiGateway'],
			relatedServices: ['PaymentService', 'AuditLoggerService', 'UserService'],
			aiSummary:
				'High structural cohesion with zero critical security CVEs. Enforces OAuth2 JWT bearer token verification.',
			recentCommits: [
				{ sha: '8f2a1b', message: 'fix: rotate JWT secret key vault', author: 'Alex Rivera', time: '2h ago' },
				{ sha: '3c9e4d', message: 'feat: add RS256 algorithm support', author: 'Sarah Chen', time: '1d ago' },
			],
			openIssues: [
				{ id: 'ISSUE-402', title: 'Cache miss fallback lock contention under high load', severity: 'MEDIUM' },
			],
			archPosition: 'Core Security Ingress',
		},
		'payment-service': {
			id: 'payment-service',
			name: 'PaymentService',
			category: 'service',
			path: 'apps/backend/app/services/payment_service.py',
			healthScore: 84.5,
			healthGrade: 'Grade B+',
			complexity: 14.8,
			riskLevel: 'HIGH',
			dependencies: ['StripeClientAdapter', 'OrderRepository', 'KafkaMessageProducer'],
			incoming: ['PaymentRouter', 'BillingWebhookConsumer'],
			relatedServices: ['AuthGatewayController', 'InvoiceService'],
			aiSummary:
				'Handles multi-currency transactions and idempotency locks. Direct database queries trigger architectural drift warnings.',
			recentCommits: [
				{ sha: '9d21e4', message: 'refactor: idempotency stripe webhook handler', author: 'Michael Zhang', time: '4h ago' },
				{ sha: '1a5b8c', message: 'fix: dead-letter queue retry exponential backoff', author: 'Alex Rivera', time: '2d ago' },
			],
			openIssues: [
				{ id: 'ISSUE-819', title: 'Refactor REST Router SQL calls into repository pattern', severity: 'HIGH' },
			],
			archPosition: 'Financial Processing Domain',
		},
		'user-repo': {
			id: 'user-repo',
			name: 'UserRepository',
			category: 'module',
			path: 'apps/backend/app/db/repositories/user_repo.py',
			healthScore: 91.2,
			healthGrade: 'Grade A',
			complexity: 6.1,
			riskLevel: 'LOW',
			dependencies: ['PostgreSQLAdapter', 'PydanticUserSchema'],
			incoming: ['AuthGatewayController', 'UserService'],
			relatedServices: ['AuthGatewayController'],
			aiSummary:
				'Clean Data Access Layer (DAL) implementing async SQLAlchemy 2.0 query patterns.',
			recentCommits: [
				{ sha: '4b7c1a', message: 'perf: optimize user indexed lookup query', author: 'David Kim', time: '3h ago' },
			],
			openIssues: [],
			archPosition: 'Persistence Abstraction',
		},
		'redis-cluster': {
			id: 'redis-cluster',
			name: 'RedisCacheCluster',
			category: 'database',
			path: 'infrastructure/redis/redis-cluster.conf',
			healthScore: 96.0,
			healthGrade: 'Grade A+',
			complexity: 4.2,
			riskLevel: 'LOW',
			dependencies: [],
			incoming: ['AuthGatewayController', 'SessionManager'],
			relatedServices: ['AuthGatewayController', 'SessionManager'],
			aiSummary:
				'In-memory data store configured with sentinel automatic failover and sub-millisecond latency.',
			recentCommits: [
				{ sha: '7e3a9c', message: 'ops: update redis cluster memory eviction policy', author: 'DevOps Bot', time: '1d ago' },
			],
			openIssues: [],
			archPosition: 'Shared Caching Layer',
		},
		'rest-api-v1': {
			id: 'rest-api-v1',
			name: 'REST API v1 Gateway',
			category: 'api',
			path: 'apps/backend/app/api/v1/router.py',
			healthScore: 88.0,
			healthGrade: 'Grade A-',
			complexity: 9.5,
			riskLevel: 'MEDIUM',
			dependencies: ['AuthGatewayController', 'PaymentRouter', 'UserRouter'],
			incoming: ['NginxIngress'],
			relatedServices: ['AuthGatewayController', 'PaymentService'],
			aiSummary:
				'FastAPI master router mapping OpenAPI endpoints to controller request handlers.',
			recentCommits: [
				{ sha: '2f8a11', message: 'feat: add OpenAPI tag annotations for docs', author: 'Sarah Chen', time: '5h ago' },
			],
			openIssues: [
				{ id: 'ISSUE-104', title: 'Unused v1 legacy route deprecation cleanup', severity: 'LOW' },
			],
			archPosition: 'Public API Surface',
		},
	};

	const selectedEntity = entityCatalog[selectedEntityId] || entityCatalog['auth-gateway'];

	// Keyboard Shortcut Ctrl+K / Cmd+K listener
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

	// Send AI Prompt Handler
	const handleSendPrompt = (promptText: string) => {
		if (!promptText.trim()) return;

		const userMsg: ChatMessage = {
			id: `msg-${Date.now()}`,
			sender: 'user',
			promptText: promptText,
			timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
		};

		// Generate dynamic AI Response visual card based on prompt keywords
		let cardTitle = 'AI Software Investigation Report';
		let summary = 'CodeAtlas analyzed repository AST graphs for the query.';
		let evidenceList = ['AST node depth check passed', 'Zero circular dependencies in target path'];
		let risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM';
		let effort = '1 Day';

		if (promptText.toLowerCase().includes('slow') || promptText.toLowerCase().includes('authentication')) {
			cardTitle = 'Authentication Performance Analysis';
			summary =
				'Authentication latency spikes are caused by synchronous database lock contention during JWT session lookup.';
			evidenceList = [
				'AuthGatewayController calls db.execute() synchronously on main event loop',
				'Redis cache lookup bypass occurring on 14.2% of authorization headers',
			];
			risk = 'HIGH';
			effort = '4 Hours';
		} else if (promptText.toLowerCase().includes('dead') || promptText.toLowerCase().includes('unused')) {
			cardTitle = 'Dead Code & Unused API Audit';
			summary = 'Found 3 unused API endpoints and 12 unreachable helper functions in legacy utils.';
			evidenceList = [
				'app/api/v1/legacy_user.py: /v1/users/export is unreferenced in router',
				'app/utils/string_helpers.py: clean_utf8_string() has zero caller nodes',
			];
			risk = 'LOW';
			effort = '2 Hours';
		} else if (promptText.toLowerCase().includes('debt') || promptText.toLowerCase().includes('refactor')) {
			cardTitle = 'Technical Debt Drag & Refactoring Target';
			summary =
				'PaymentService contains highest technical debt drag ($18.5k/yr) due to direct SQL execution in REST route handlers.';
			evidenceList = [
				'Cyclomatic complexity score is 14.8 (Threshold: 10.0)',
				'Direct SQL query execution bypassing Repository DAL',
			];
			risk = 'HIGH';
			effort = '2.5 Days';
		}

		const aiMsg: ChatMessage = {
			id: `msg-${Date.now() + 1}`,
			sender: 'ai',
			timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
			cardData: {
				title: cardTitle,
				problemSummary: summary,
				evidence: evidenceList,
				affectedFiles: [selectedEntity.path, 'apps/backend/app/core/config.py'],
				graphNodes: [
					{ id: 'n1', name: selectedEntity.name, type: 'Service', color: '#38bdf8' },
					{ id: 'n2', name: 'DatabasePool', type: 'Infrastructure', color: '#fbbf24' },
					{ id: 'n3', name: 'LoggerWorker', type: 'Module', color: '#f472b6' },
				],
				archView: selectedEntity.archPosition,
				riskLevel: risk,
				confidenceScore: '95.8%',
				nextActions: [
					'Simulate refactoring impact using CodeAtlas scenario simulator',
					'Extract direct query logic into isolated repository class handlers',
					'Apply automated patch PR via CodeAtlas Auto-Improve',
				],
				estimatedEffort: effort,
			},
		};

		setMessages((prev) => [...prev, userMsg, aiMsg]);
		setChatInput('');
	};

	// Filter Explorer Tree Nodes based on search input
	const matchesSearch = (text: string) => {
		if (!treeSearch) return true;
		return text.toLowerCase().includes(treeSearch.toLowerCase());
	};

	return (
		<div className="flex flex-col h-[calc(100vh-5rem)] bg-slate-950 text-white font-sans overflow-hidden rounded-2xl border border-slate-800/80 shadow-2xl relative">
			{/* Command Palette Modal (Ctrl+K) */}
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
								placeholder="Search functions, classes, APIs, commits, dependencies, configs..."
								className="w-full bg-transparent text-sm text-white focus:outline-none font-mono"
							/>
							<button
								onClick={() => setIsCmdKOpen(false)}
								className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
							>
								ESC
							</button>
						</div>

						<div className="space-y-1 max-h-80 overflow-y-auto pr-1">
							{Object.values(entityCatalog)
								.filter(
									(item) =>
										item.name.toLowerCase().includes(cmdKQuery.toLowerCase()) ||
										item.path.toLowerCase().includes(cmdKQuery.toLowerCase())
								)
								.map((item) => (
									<div
										key={item.id}
										onClick={() => {
											setSelectedEntityId(item.id);
											setIsCmdKOpen(false);
										}}
										className="flex items-center justify-between p-3 rounded-xl hover:bg-cyan-500/10 hover:border-cyan-500/30 border border-transparent cursor-pointer transition-all text-xs font-mono"
									>
										<div className="flex items-center gap-2.5">
											<Code2 className="w-4 h-4 text-cyan-400" />
											<div>
												<p className="font-bold text-white">{item.name}</p>
												<p className="text-[10px] text-slate-400">{item.path}</p>
											</div>
										</div>
										<span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-cyan-300 uppercase">
											{item.category}
										</span>
									</div>
								))}
						</div>
					</div>
				</div>
			)}

			{/* Architecture Focus Mode Fullscreen Modal */}
			{focusModeNode && (
				<div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl p-6 flex flex-col justify-between font-sans">
					<div className="flex justify-between items-center border-b border-slate-800 pb-4">
						<div className="flex items-center gap-3">
							<Building2 className="w-6 h-6 text-cyan-400 animate-pulse" />
							<div>
								<h2 className="text-xl font-black text-white">
									Architecture Focus Mode — <span className="text-cyan-300 font-mono">{focusModeNode.name}</span>
								</h2>
								<p className="text-xs text-slate-400 font-mono">{focusModeNode.path}</p>
							</div>
						</div>
						<Button
							onClick={() => setFocusModeNode(null)}
							variant="outline"
							className="text-xs font-bold bg-slate-900 border-slate-800 text-slate-300"
						>
							<X className="w-4 h-4 mr-1" /> Exit Focus Mode
						</Button>
					</div>

					<div className="my-auto w-full max-w-4xl mx-auto h-[480px] bg-slate-950 border border-cyan-500/40 rounded-3xl p-6 relative flex items-center justify-center">
						<svg className="w-full h-full">
							<line x1="200" y1="240" x2="450" y2="120" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
							<line x1="450" y1="120" x2="700" y2="240" stroke="#818cf8" strokeWidth="2" />
							<line x1="200" y1="240" x2="450" y2="360" stroke="#34d399" strokeWidth="2" />

							<circle cx="200" cy="240" r="32" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
							<text x="200" y="244" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">
								Caller Gateway
							</text>

							<circle cx="450" cy="120" r="40" fill="#0f172a" stroke="#818cf8" strokeWidth="4" />
							<text x="450" y="124" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
								{focusModeNode.name}
							</text>

							<circle cx="700" cy="240" r="32" fill="#0f172a" stroke="#fbbf24" strokeWidth="3" />
							<text x="700" y="244" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">
								Database DAL
							</text>

							<circle cx="450" cy="360" r="32" fill="#0f172a" stroke="#34d399" strokeWidth="3" />
							<text x="450" y="364" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">
								Redis Cache
							</text>
						</svg>
					</div>

					<div className="flex justify-between items-center pt-4 border-t border-slate-800 text-xs text-slate-400 font-mono">
						<span>Double-click focus mode active. All external dependency edges isolated.</span>
						<span className="text-emerald-400 font-bold">Topology Isolation: 100%</span>
					</div>
				</div>
			)}

			{/* Top Workspace Navigation Bar */}
			<div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/60 font-mono text-xs">
				<div className="flex items-center gap-3">
					<div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
						<Brain className="w-4 h-4" />
					</div>
					<div className="flex items-center gap-2">
						<span className="font-black text-white">AI Investigation Workspace</span>
						<span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
							SYNCHRONIZED AST AGENT
						</span>
					</div>
				</div>

				{/* Global Command Palette Trigger */}
				<button
					onClick={() => setIsCmdKOpen(true)}
					className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/40 transition-all"
				>
					<Search className="w-3.5 h-3.5 text-cyan-400" />
					<span>Search repository entities...</span>
					<kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-bold border border-slate-700">
						⌘K / Ctrl+K
					</kbd>
				</button>
			</div>

			{/* ========================================================================= */}
			{/* MAIN 3-COLUMN LAYOUT CONTAINER (LEFT, CENTER, RIGHT PANELS) */}
			{/* ========================================================================= */}
			<div className="flex flex-1 overflow-hidden">
				{/* ------------------------------------------------------------------------- */}
				{/* LEFT PANEL: REPOSITORY EXPLORER TREE */}
				{/* ------------------------------------------------------------------------- */}
				<div className="w-72 border-r border-slate-800/80 bg-slate-950/80 flex flex-col justify-between shrink-0 font-mono">
					{/* Explorer Search Input */}
					<div className="p-3 border-b border-slate-800/80 space-y-2">
						<span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
							Repository Explorer
						</span>
						<div className="relative">
							<Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
							<input
								type="text"
								value={treeSearch}
								onChange={(e) => setTreeSearch(e.target.value)}
								placeholder="Filter tree..."
								className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
							/>
						</div>
					</div>

					{/* Expandable Tree Categories */}
					<div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
						{/* Category: Services */}
						<div className="space-y-1">
							<button
								onClick={() => setExpandedCategories((c) => ({ ...c, services: !c.services }))}
								className="flex items-center justify-between w-full text-slate-400 hover:text-white font-bold py-1"
							>
								<span className="flex items-center gap-1.5 text-cyan-400">
									{expandedCategories.services ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
									<Layers className="w-3.5 h-3.5" /> Services
								</span>
								<span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 font-bold">2</span>
							</button>

							{expandedCategories.services && (
								<div className="pl-4 space-y-1">
									{['auth-gateway', 'payment-service'].map((id) => {
										const item = entityCatalog[id];
										if (!matchesSearch(item.name)) return null;
										const isSelected = selectedEntityId === id;
										const isHovered = hoveredEntityId === id;

										return (
											<div
												key={id}
												onClick={() => setSelectedEntityId(id)}
												onDoubleClick={() => setFocusModeNode(item)}
												onMouseEnter={() => setHoveredEntityId(id)}
												onMouseLeave={() => setHoveredEntityId(null)}
												className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
													isSelected
														? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold shadow-sm shadow-cyan-950/50'
														: isHovered
															? 'bg-slate-900 border-slate-700 text-white'
															: 'border-transparent text-slate-300 hover:bg-slate-900/50'
												}`}
											>
												<span className="truncate">{item.name}</span>
												<span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-emerald-400">
													{item.healthScore}
												</span>
											</div>
										);
									})}
								</div>
							)}
						</div>

						{/* Category: Modules */}
						<div className="space-y-1">
							<button
								onClick={() => setExpandedCategories((c) => ({ ...c, modules: !c.modules }))}
								className="flex items-center justify-between w-full text-slate-400 hover:text-white font-bold py-1"
							>
								<span className="flex items-center gap-1.5 text-indigo-400">
									{expandedCategories.modules ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
									<Code2 className="w-3.5 h-3.5" /> Modules & Repos
								</span>
								<span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 font-bold">1</span>
							</button>

							{expandedCategories.modules && (
								<div className="pl-4 space-y-1">
									{['user-repo'].map((id) => {
										const item = entityCatalog[id];
										if (!matchesSearch(item.name)) return null;
										const isSelected = selectedEntityId === id;

										return (
											<div
												key={id}
												onClick={() => setSelectedEntityId(id)}
												onDoubleClick={() => setFocusModeNode(item)}
												className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
													isSelected
														? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 font-bold'
														: 'border-transparent text-slate-300 hover:bg-slate-900/50'
												}`}
											>
												<span className="truncate">{item.name}</span>
												<span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-emerald-400">
													{item.healthScore}
												</span>
											</div>
										);
									})}
								</div>
							)}
						</div>

						{/* Category: APIs */}
						<div className="space-y-1">
							<button
								onClick={() => setExpandedCategories((c) => ({ ...c, apis: !c.apis }))}
								className="flex items-center justify-between w-full text-slate-400 hover:text-white font-bold py-1"
							>
								<span className="flex items-center gap-1.5 text-emerald-400">
									{expandedCategories.apis ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
									<Server className="w-3.5 h-3.5" /> REST & GraphQL APIs
								</span>
								<span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 font-bold">1</span>
							</button>

							{expandedCategories.apis && (
								<div className="pl-4 space-y-1">
									{['rest-api-v1'].map((id) => {
										const item = entityCatalog[id];
										if (!matchesSearch(item.name)) return null;
										const isSelected = selectedEntityId === id;

										return (
											<div
												key={id}
												onClick={() => setSelectedEntityId(id)}
												onDoubleClick={() => setFocusModeNode(item)}
												className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
													isSelected
														? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold'
														: 'border-transparent text-slate-300 hover:bg-slate-900/50'
												}`}
											>
												<span className="truncate">{item.name}</span>
												<span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-emerald-400">
													{item.healthScore}
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
								onClick={() => setExpandedCategories((c) => ({ ...c, databases: !c.databases }))}
								className="flex items-center justify-between w-full text-slate-400 hover:text-white font-bold py-1"
							>
								<span className="flex items-center gap-1.5 text-amber-400">
									{expandedCategories.databases ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
									<Database className="w-3.5 h-3.5" /> Databases & Caches
								</span>
								<span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 font-bold">1</span>
							</button>

							{expandedCategories.databases && (
								<div className="pl-4 space-y-1">
									{['redis-cluster'].map((id) => {
										const item = entityCatalog[id];
										if (!matchesSearch(item.name)) return null;
										const isSelected = selectedEntityId === id;

										return (
											<div
												key={id}
												onClick={() => setSelectedEntityId(id)}
												onDoubleClick={() => setFocusModeNode(item)}
												className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
													isSelected
														? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
														: 'border-transparent text-slate-300 hover:bg-slate-900/50'
												}`}
											>
												<span className="truncate">{item.name}</span>
												<span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-emerald-400">
													{item.healthScore}
												</span>
											</div>
										);
									})}
								</div>
							)}
						</div>
					</div>

					<div className="p-3 border-t border-slate-800 text-[10px] text-slate-500 text-center">
						Double-click any node for Focus Mode
					</div>
				</div>

				{/* ------------------------------------------------------------------------- */}
				{/* CENTER PANEL: INTERACTIVE CONVERSATION (CHATGPT MEETS GITHUB MEETS MAPS) */}
				{/* ------------------------------------------------------------------------- */}
				<div className="flex-1 flex flex-col justify-between bg-slate-900/40 font-sans border-r border-slate-800/80 overflow-hidden">
					{/* Quick Prompts Bar */}
					<div className="p-3 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
						<span className="text-[10px] font-black uppercase font-mono text-cyan-400 shrink-0">
							Quick Prompts:
						</span>
						{quickPrompts.slice(0, 5).map((prompt, i) => (
							<button
								key={i}
								onClick={() => handleSendPrompt(prompt)}
								className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-white hover:border-cyan-500/40 whitespace-nowrap transition-all"
							>
								{prompt}
							</button>
						))}
					</div>

					{/* Conversation Stream */}
					<div className="flex-1 overflow-y-auto p-5 space-y-6">
						{messages.map((msg) => (
							<div key={msg.id} className="space-y-3">
								{msg.sender === 'user' ? (
									<div className="flex justify-end">
										<div className="bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-2.5 text-xs font-bold shadow-md max-w-md">
											{msg.promptText}
										</div>
									</div>
								) : (
									<div className="glass-card rounded-2xl p-5 border border-cyan-500/30 bg-slate-900/80 space-y-4 shadow-xl">
										{/* AI Card Title */}
										<div className="flex items-center justify-between border-b border-slate-800 pb-3">
											<div className="flex items-center gap-2">
												<div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
													<Brain className="w-4 h-4" />
												</div>
												<h3 className="text-sm font-black text-white">{msg.cardData?.title}</h3>
											</div>
											<div className="flex items-center gap-2 font-mono text-[10px]">
												<span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
													Confidence: {msg.cardData?.confidenceScore}
												</span>
												<span
													className={`px-2 py-0.5 rounded font-bold uppercase ${
														msg.cardData?.riskLevel === 'HIGH'
															? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
															: 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
													}`}
												>
													{msg.cardData?.riskLevel} Risk
												</span>
											</div>
										</div>

										{/* Problem Summary */}
										<p className="text-xs text-slate-300 leading-relaxed font-sans">
											{msg.cardData?.problemSummary}
										</p>

										{/* Evidence List */}
										<div className="space-y-1.5 bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 font-mono text-[11px]">
											<span className="text-[9px] font-bold uppercase text-slate-400 block">
												Evidence & Measured Findings
											</span>
											{msg.cardData?.evidence.map((ev, idx) => (
												<div key={idx} className="flex items-start gap-2 text-slate-300">
													<CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
													<span>{ev}</span>
												</div>
											))}
										</div>

										{/* Interactive Mini Dependency Graph Snippet */}
										<div className="bg-slate-950 rounded-xl p-3 border border-slate-900 space-y-2">
											<span className="text-[9px] font-mono font-bold uppercase text-slate-400 block">
												Dependency Edge View
											</span>
											<svg className="w-full h-24">
												<line x1="40" y1="48" x2="160" y2="48" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
												<line x1="160" y1="48" x2="280" y2="48" stroke="#818cf8" strokeWidth="2" />
												{msg.cardData?.graphNodes.map((gn, i) => (
													<g key={gn.id}>
														<circle cx={40 + i * 120} cy={48} r={16} fill="#090d16" stroke={gn.color} strokeWidth="2" />
														<text x={40 + i * 120} y={80} textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace">
															{gn.name}
														</text>
													</g>
												))}
											</svg>
										</div>

										{/* Required Response Action Buttons */}
										<div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-800/80 gap-2">
											<div className="flex items-center gap-2">
												<Link href="/simulate">
													<Button size="sm" className="h-7 text-[11px] font-bold bg-cyan-600 hover:bg-cyan-500 text-white gap-1">
														<Play className="w-3 h-3" /> Simulate
													</Button>
												</Link>
												<Link href="/dependency-graph">
													<Button size="sm" variant="outline" className="h-7 text-[11px] font-bold bg-slate-900 border-slate-800 text-slate-300 gap-1">
														<Network className="w-3 h-3 text-cyan-400" /> View Graph
													</Button>
												</Link>
												<Button size="sm" variant="outline" className="h-7 text-[11px] font-bold bg-slate-900 border-slate-800 text-slate-300 gap-1">
													<FileText className="w-3 h-3 text-indigo-400" /> Create Issue
												</Button>
											</div>

											<button
												onClick={() => handleSendPrompt(`Explain further about ${msg.cardData?.title}`)}
												className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 font-bold"
											>
												Explain Further <ArrowRight className="w-3.5 h-3.5" />
											</button>
										</div>
									</div>
								)}
							</div>
						))}
					</div>

					{/* Chat Input Bar */}
					<div className="p-4 border-t border-slate-800 bg-slate-950/80">
						<form
							onSubmit={(e) => {
								e.preventDefault();
								handleSendPrompt(chatInput);
							}}
							className="flex items-center gap-3"
						>
							<input
								type="text"
								value={chatInput}
								onChange={(e) => setChatInput(e.target.value)}
								placeholder="Ask CodeAtlas AI about services, coupling, debt, or architecture..."
								className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
							/>
							<Button
								type="submit"
								className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs px-5 gap-1.5"
							>
								<Send className="w-3.5 h-3.5" /> Send
							</Button>
						</form>
					</div>
				</div>

				{/* ------------------------------------------------------------------------- */}
				{/* RIGHT PANEL: DYNAMIC CONTEXT PANEL (SYNCHRONIZED WITH SELECTION) */}
				{/* ------------------------------------------------------------------------- */}
				<div className="w-80 border-l border-slate-800/80 bg-slate-950/90 p-4 flex flex-col justify-between shrink-0 font-mono space-y-4 overflow-y-auto">
					<div className="space-y-4">
						{/* Context Header */}
						<div className="flex items-center justify-between border-b border-slate-800 pb-3">
							<div>
								<span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider block">
									Context Inspector
								</span>
								<h3 className="text-base font-black text-white mt-0.5">{selectedEntity.name}</h3>
							</div>
							<span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20 uppercase">
								{selectedEntity.category}
							</span>
						</div>

						{/* Health & Complexity Gauges */}
						<div className="grid grid-cols-2 gap-2">
							<div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-center">
								<span className="text-[9px] text-slate-400 uppercase font-bold block">Health Score</span>
								<span className="text-lg font-black text-emerald-400">{selectedEntity.healthScore}</span>
							</div>
							<div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-center">
								<span className="text-[9px] text-slate-400 uppercase font-bold block">Complexity</span>
								<span className="text-lg font-black text-cyan-300">{selectedEntity.complexity}</span>
							</div>
						</div>

						{/* Architecture Position */}
						<div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 space-y-1">
							<span className="text-[9px] text-slate-400 uppercase font-bold block">Architecture Position</span>
							<span className="text-xs font-bold text-indigo-300">{selectedEntity.archPosition}</span>
						</div>

						{/* AI Architectural Summary */}
						<div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-3 space-y-1">
							<span className="text-[9px] font-black text-indigo-300 uppercase block">AI Summary</span>
							<p className="text-[11px] text-slate-300 font-sans leading-snug">{selectedEntity.aiSummary}</p>
						</div>

						{/* Dependencies List */}
						<div className="space-y-1.5">
							<span className="text-[10px] font-bold text-slate-400 uppercase block">
								Outgoing Dependencies ({selectedEntity.dependencies.length})
							</span>
							<div className="flex flex-wrap gap-1">
								{selectedEntity.dependencies.map((dep, i) => (
									<span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
										{dep}
									</span>
								))}
							</div>
						</div>

						{/* Recent Commits */}
						<div className="space-y-2">
							<span className="text-[10px] font-bold text-slate-400 uppercase block">Recent Commits</span>
							{selectedEntity.recentCommits.map((c, i) => (
								<div key={i} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] space-y-0.5">
									<p className="font-bold text-white truncate">{c.message}</p>
									<p className="text-slate-500">{c.author} • {c.time}</p>
								</div>
							))}
						</div>
					</div>

					{/* Required Context Action Buttons */}
					<div className="space-y-2 pt-3 border-t border-slate-800">
						<Link href="/dependency-graph" className="w-full block">
							<Button className="w-full h-8 text-[11px] font-bold bg-cyan-600 hover:bg-cyan-500 text-white gap-1.5">
								<Network className="w-3.5 h-3.5" /> Open Graph
							</Button>
						</Link>

						<Link href="/simulate" className="w-full block">
							<Button variant="outline" className="w-full h-8 text-[11px] font-bold bg-slate-900 border-slate-800 text-slate-300 gap-1.5">
								<Play className="w-3.5 h-3.5 text-cyan-400" /> Run Simulation
							</Button>
						</Link>

						<Button variant="outline" className="w-full h-8 text-[11px] font-bold bg-slate-900 border-slate-800 text-slate-300 gap-1.5">
							<Flame className="w-3.5 h-3.5 text-amber-400" /> Find Risks
						</Button>

						<Button variant="outline" className="w-full h-8 text-[11px] font-bold bg-slate-900 border-slate-800 text-slate-300 gap-1.5">
							<FileText className="w-3.5 h-3.5 text-indigo-400" /> Generate Documentation
						</Button>
					</div>
				</div>
			</div>

			{/* ========================================================================= */}
			{/* BOTTOM PANEL: LIVE ACTIVITY TIMELINE TICKER */}
			{/* ========================================================================= */}
			<div className="h-10 border-t border-slate-800 bg-slate-950 font-mono text-[11px] flex items-center justify-between px-5 text-slate-400 shrink-0">
				<div className="flex items-center gap-3 overflow-hidden">
					<span className="text-emerald-400 font-bold flex items-center gap-1.5 shrink-0">
						<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> LIVE ACTIVITY:
					</span>
					<span className="truncate text-slate-300">
						[10m ago] Continuous AST index updated (35 files, 4,500 LOC) • [1h ago] SOC2 compliance check passed (96%) • [3h ago] Architecture drift alert resolved in Auth module
					</span>
				</div>

				<div className="flex items-center gap-4 shrink-0 font-bold">
					<span className="text-cyan-400">Health: 92/100</span>
					<span className="text-purple-400">Risk: LOW</span>
				</div>
			</div>
		</div>
	);
}
