'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
	Zap,
	Play,
	CheckCircle2,
	RefreshCw,
	Database,
	Layers,
	ExternalLink,
	Trash2,
	Split,
	Merge,
	Edit3,
	PackagePlus,
	ArrowUpRight,
	HardDrive,
	Cloud,
	Cpu,
	Server,
	ShieldAlert,
	Sparkles,
	Undo2,
	Redo2,
	ZoomIn,
	ZoomOut,
	Maximize2,
	Minimize2,
	Search,
	Columns,
	Square,
	Flame,
	FileText,
	Check,
	X,
	ChevronRight,
	Command,
	Code2,
	Activity,
	HeartPulse,
	Building2,
	Network,
	ArrowRight,
	Lock,
	Scale,
	Radio,
	Sliders,
	HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Canvas Node Schema
interface CanvasNode {
	id: string;
	name: string;
	type: 'service' | 'package' | 'module' | 'database' | 'api' | 'queue' | 'infrastructure';
	x: number;
	y: number;
	status: 'active' | 'added' | 'removed' | 'modified' | 'risk';
	health: number;
	complexity: number;
	riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
	dependencies: string[];
	consumers: string[];
	providers: string[];
	recentChanges: string;
	techDebt: string;
	performance: string;
	security: string;
	owner: string;
	aiSummary: string;
}

// Simulation Template Schema
interface SimulationTemplate {
	id: string;
	title: string;
	category: 'Refactoring' | 'Infrastructure' | 'Database' | 'Optimization';
	icon: React.ElementType;
	description: string;
	targetNodeId: string;
	actionType: 'delete' | 'split' | 'merge' | 'rename' | 'upgrade' | 'replace' | 'add_cache' | 'add_queue' | 'scale';
}

// History Step State for Timeline & Undo/Redo
interface HistoryStep {
	id: string;
	title: string;
	timestamp: string;
	affectedNodeId: string;
	actionType: string;
}

export function EngineeringSimulationStudio() {
	// Mode: 'single' (full canvas) or 'split' (side-by-side comparison: Current vs Proposed)
	const [viewMode, setViewMode] = useState<'single' | 'split'>('single');
	const [zoomLevel, setZoomLevel] = useState<number>(100);

	// Selected Node ID & Multi-selection
	const [selectedNodeId, setSelectedNodeId] = useState<string>('node-auth');
	const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

	// Simulation Library Active Selection
	const [activeCategory, setActiveCategory] = useState<string>('all');
	const [templateSearch, setTemplateSearch] = useState<string>('');

	// Node Dragging State
	const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
	const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

	// Context Menu (Right Click) State
	const [contextMenu, setContextMenu] = useState<{ x: number; y: number; nodeId: string } | null>(null);

	// Command Palette Modal State (Ctrl+K)
	const [isCmdKOpen, setIsCmdKOpen] = useState<boolean>(false);
	const [cmdKQuery, setCmdKQuery] = useState<string>('');

	// Canvas Node Definitions
	const [nodes, setNodes] = useState<Record<string, CanvasNode>>({
		'node-auth': {
			id: 'node-auth',
			name: 'AuthGatewayController',
			type: 'service',
			x: 220,
			y: 160,
			status: 'active',
			health: 94.0,
			complexity: 8.2,
			riskLevel: 'LOW',
			dependencies: ['node-jwt', 'node-user', 'node-redis'],
			consumers: ['node-router'],
			providers: ['node-jwt', 'node-user'],
			recentChanges: 'fix: rotate JWT secret key vault (2h ago)',
			techDebt: '$2.1k/yr',
			performance: '12ms avg latency',
			security: 'Zero CVEs • SOC2 Compliant',
			owner: 'Security Core Team',
			aiSummary:
				'OAuth2 JWT authentication gateway handling user token validation and session locks.',
		},
		'node-jwt': {
			id: 'node-jwt',
			name: 'JwtValidatorService',
			type: 'module',
			x: 480,
			y: 100,
			status: 'active',
			health: 91.5,
			complexity: 6.4,
			riskLevel: 'LOW',
			dependencies: ['node-redis'],
			consumers: ['node-auth'],
			providers: ['node-redis'],
			recentChanges: 'feat: add RS256 algorithm support (1d ago)',
			techDebt: '$0.8k/yr',
			performance: '4ms avg latency',
			security: 'Clean AST isolation',
			owner: 'Security Core Team',
			aiSummary: 'Cryptographic signature verification engine for RS256/HS256 tokens.',
		},
		'node-payment': {
			id: 'node-payment',
			name: 'PaymentService',
			type: 'service',
			x: 480,
			y: 280,
			status: 'risk',
			health: 82.0,
			complexity: 14.8,
			riskLevel: 'HIGH',
			dependencies: ['node-user', 'node-stripe', 'node-kafka'],
			consumers: ['node-router'],
			providers: ['node-stripe'],
			recentChanges: 'refactor: idempotency webhook handler (4h ago)',
			techDebt: '$18.5k/yr',
			performance: '180ms avg latency',
			security: 'Direct REST SQL query coupling',
			owner: 'Payments Domain Team',
			aiSummary:
				'Multi-currency processing pipeline. High complexity due to inline database query logic.',
		},
		'node-user': {
			id: 'node-user',
			name: 'UserRepository',
			type: 'package',
			x: 740,
			y: 180,
			status: 'active',
			health: 92.4,
			complexity: 5.8,
			riskLevel: 'LOW',
			dependencies: ['node-postgres'],
			consumers: ['node-auth', 'node-payment'],
			providers: ['node-postgres'],
			recentChanges: 'perf: optimize user indexed lookup query (3h ago)',
			techDebt: '$1.2k/yr',
			performance: '8ms avg latency',
			security: 'SQLAlchemy 2.0 async DAL',
			owner: 'Core Platform Team',
			aiSummary: 'Data Access Layer (DAL) wrapping async PostgreSQL queries.',
		},
		'node-redis': {
			id: 'node-redis',
			name: 'RedisCacheCluster',
			type: 'database',
			x: 740,
			y: 60,
			status: 'active',
			health: 98.0,
			complexity: 3.2,
			riskLevel: 'LOW',
			dependencies: [],
			consumers: ['node-jwt', 'node-auth'],
			providers: [],
			recentChanges: 'ops: memory eviction policy update (1d ago)',
			techDebt: '$0.0k/yr',
			performance: '1.2ms avg latency',
			security: 'Sentinel TLS enabled',
			owner: 'DevOps / Infra',
			aiSummary: 'In-memory token cache cluster handling 50k req/sec peak loads.',
		},
		'node-postgres': {
			id: 'node-postgres',
			name: 'PostgreSQLPrimaryDB',
			type: 'database',
			x: 980,
			y: 200,
			status: 'active',
			health: 89.0,
			complexity: 7.1,
			riskLevel: 'MEDIUM',
			dependencies: [],
			consumers: ['node-user'],
			providers: [],
			recentChanges: 'migration: add user idempotency index (2d ago)',
			techDebt: '$3.4k/yr',
			performance: '18ms query average',
			security: 'Row-Level Security (RLS)',
			owner: 'Database Admins',
			aiSummary: 'Primary relational datastore supporting transactional ACID workloads.',
		},
		'node-stripe': {
			id: 'node-stripe',
			name: 'StripeAPIAdapter',
			type: 'api',
			x: 740,
			y: 360,
			status: 'active',
			health: 95.0,
			complexity: 4.5,
			riskLevel: 'LOW',
			dependencies: [],
			consumers: ['node-payment'],
			providers: [],
			recentChanges: 'sdk: upgrade Stripe API v2024-04 (5d ago)',
			techDebt: '$0.5k/yr',
			performance: '210ms external HTTP',
			security: 'HMAC signature verified',
			owner: 'Payments Domain Team',
			aiSummary: 'External payment gateway adapter handling checkout webhooks.',
		},
		'node-kafka': {
			id: 'node-kafka',
			name: 'KafkaEventBroker',
			type: 'queue',
			x: 480,
			y: 420,
			status: 'added',
			health: 96.5,
			complexity: 5.0,
			riskLevel: 'LOW',
			dependencies: [],
			consumers: ['node-payment'],
			providers: [],
			recentChanges: 'infra: deploy event broker cluster (1w ago)',
			techDebt: '$0.0k/yr',
			performance: '2ms queue throughput',
			security: 'SASL/SCRAM auth',
			owner: 'Event Stream Infra',
			aiSummary: 'Asynchronous event streaming bus for domain event publishing.',
		},
	});

	// Simulation History & Undo/Redo Timeline
	const [history, setHistory] = useState<HistoryStep[]>([
		{
			id: 'step-1',
			title: 'Initial Architecture Analysis Loaded',
			timestamp: '10:00 AM',
			affectedNodeId: 'node-auth',
			actionType: 'load',
		},
	]);
	const [historyIndex, setHistoryIndex] = useState<number>(0);

	// 16 Guided Simulation Templates
	const simulationTemplates: SimulationTemplate[] = [
		{
			id: 'sim-delete-service',
			title: 'Delete Service',
			category: 'Refactoring',
			icon: Trash2,
			description: 'Simulate removing a service and calculate cascading breakages.',
			targetNodeId: 'node-auth',
			actionType: 'delete',
		},
		{
			id: 'sim-split-service',
			title: 'Split Service',
			category: 'Refactoring',
			icon: Split,
			description: 'Decouple monolithic payment processing into microservices.',
			targetNodeId: 'node-payment',
			actionType: 'split',
		},
		{
			id: 'sim-merge-services',
			title: 'Merge Services',
			category: 'Refactoring',
			icon: Merge,
			description: 'Combine tightly coupled services to reduce network hop latency.',
			targetNodeId: 'node-jwt',
			actionType: 'merge',
		},
		{
			id: 'sim-rename-module',
			title: 'Rename Module',
			category: 'Refactoring',
			icon: Edit3,
			description: 'Simulate package renaming and trace all file reference updates.',
			targetNodeId: 'node-user',
			actionType: 'rename',
		},
		{
			id: 'sim-extract-package',
			title: 'Extract Package',
			category: 'Refactoring',
			icon: PackagePlus,
			description: 'Extract common authentication helpers into shared npm package.',
			targetNodeId: 'node-jwt',
			actionType: 'split',
		},
		{
			id: 'sim-upgrade-dep',
			title: 'Upgrade Dependency',
			category: 'Optimization',
			icon: ArrowUpRight,
			description: 'Upgrade Pydantic v1 to v2 settings objects and test breaking changes.',
			targetNodeId: 'node-payment',
			actionType: 'upgrade',
		},
		{
			id: 'sim-replace-db',
			title: 'Replace Database',
			category: 'Database',
			icon: Database,
			description: 'Swap primary relational datastore with distributed CockroachDB.',
			targetNodeId: 'node-postgres',
			actionType: 'replace',
		},
		{
			id: 'sim-move-microservices',
			title: 'Move to Microservices',
			category: 'Infrastructure',
			icon: Cloud,
			description: 'Migrate modular monolith domain boundaries into Kubernetes pods.',
			targetNodeId: 'node-auth',
			actionType: 'scale',
		},
		{
			id: 'sim-introduce-cache',
			title: 'Introduce Cache',
			category: 'Database',
			icon: HardDrive,
			description: 'Add Redis cache layer to eliminate direct database lock contention.',
			targetNodeId: 'node-redis',
			actionType: 'add_cache',
		},
		{
			id: 'sim-introduce-queue',
			title: 'Introduce Queue',
			category: 'Infrastructure',
			icon: Radio,
			description: 'Publish asynchronous domain events to Kafka message broker.',
			targetNodeId: 'node-kafka',
			actionType: 'add_queue',
		},
		{
			id: 'sim-scale-service',
			title: 'Scale Service',
			category: 'Infrastructure',
			icon: Scale,
			description: 'Simulate 100x traffic spike on REST ingress gateway.',
			targetNodeId: 'node-auth',
			actionType: 'scale',
		},
		{
			id: 'sim-remove-dead-code',
			title: 'Remove Dead Code',
			category: 'Refactoring',
			icon: Flame,
			description: 'Purge unused API endpoints and unreachable utility methods.',
			targetNodeId: 'node-payment',
			actionType: 'delete',
		},
		{
			id: 'sim-optimize-deps',
			title: 'Optimize Dependencies',
			category: 'Optimization',
			icon: Sliders,
			description: 'Eliminate duplicate sub-dependencies and tree-shake bundles.',
			targetNodeId: 'node-jwt',
			actionType: 'upgrade',
		},
		{
			id: 'sim-security-hardening',
			title: 'Security Hardening',
			category: 'Infrastructure',
			icon: Lock,
			description: 'Enforce SOC2 mTLS encryption across service-to-service calls.',
			targetNodeId: 'node-auth',
			actionType: 'upgrade',
		},
		{
			id: 'sim-cloud-migration',
			title: 'Cloud Migration',
			category: 'Infrastructure',
			icon: Cloud,
			description: 'Migrate on-prem servers to AWS Elastic Kubernetes Service (EKS).',
			targetNodeId: 'node-postgres',
			actionType: 'replace',
		},
		{
			id: 'sim-api-upgrade',
			title: 'API Version Upgrade',
			category: 'Optimization',
			icon: Server,
			description: 'Deprecate v1 REST endpoints in favor of v2 GraphQL schema.',
			targetNodeId: 'node-stripe',
			actionType: 'upgrade',
		},
	];

	const selectedNode = nodes[selectedNodeId] || nodes['node-auth'];

	// Keyboard Shortcut Listener (Ctrl+Z, Ctrl+Y, Ctrl+S, Ctrl+K)
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey || e.metaKey) {
				if (e.key === 'z') {
					e.preventDefault();
					handleUndo();
				} else if (e.key === 'y') {
					e.preventDefault();
					handleRedo();
				} else if (e.key === 's') {
					e.preventDefault();
					setViewMode((v) => (v === 'single' ? 'split' : 'single'));
				} else if (e.key === 'k') {
					e.preventDefault();
					setIsCmdKOpen((prev) => !prev);
				} else if (e.key === '0') {
					e.preventDefault();
					setZoomLevel(100);
				}
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [historyIndex, history]);

	// Execute Simulation Workflow
	const runSimulation = (tpl: SimulationTemplate) => {
		const target = nodes[tpl.targetNodeId] || selectedNode;

		// Update node status visually based on simulation
		setNodes((prev) => {
			const updated = { ...prev };
			if (tpl.actionType === 'delete') {
				updated[target.id] = { ...target, status: 'removed', riskLevel: 'HIGH', health: 65.0 };
			} else if (tpl.actionType === 'split') {
				updated[target.id] = { ...target, status: 'modified', complexity: 7.2, health: 95.0, riskLevel: 'LOW' };
			} else if (tpl.actionType === 'add_cache') {
				updated[target.id] = { ...target, status: 'added', health: 98.0, performance: '0.8ms cached' };
			} else {
				updated[target.id] = { ...target, status: 'modified', health: Math.min(99, target.health + 5) };
			}
			return updated;
		});

		setSelectedNodeId(target.id);

		// Record step in timeline
		const newStep: HistoryStep = {
			id: `step-${Date.now()}`,
			title: `Executed ${tpl.title} on ${target.name}`,
			timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
			affectedNodeId: target.id,
			actionType: tpl.actionType,
		};

		const nextHistory = [...history.slice(0, historyIndex + 1), newStep];
		setHistory(nextHistory);
		setHistoryIndex(nextHistory.length - 1);
	};

	// Undo/Redo Handlers
	const handleUndo = () => {
		if (historyIndex > 0) {
			setHistoryIndex((prev) => prev - 1);
			const step = history[historyIndex - 1];
			if (step) {
				setSelectedNodeId(step.affectedNodeId);
			}
		}
	};

	const handleRedo = () => {
		if (historyIndex < history.length - 1) {
			setHistoryIndex((prev) => prev + 1);
			const step = history[historyIndex + 1];
			if (step) {
				setSelectedNodeId(step.affectedNodeId);
			}
		}
	};

	// Node Dragging Handlers
	const handleMouseDownNode = (e: React.MouseEvent, nodeId: string) => {
		e.stopPropagation();
		setSelectedNodeId(nodeId);
		setDraggedNodeId(nodeId);
		const node = nodes[nodeId];
		if (node) {
			setDragOffset({ x: e.clientX - node.x, y: e.clientY - node.y });
		}
	};

	const handleMouseMoveCanvas = (e: React.MouseEvent) => {
		if (!draggedNodeId) return;
		const nextX = e.clientX - dragOffset.x;
		const nextY = e.clientY - dragOffset.y;
		setNodes((prev) => ({
			...prev,
			[draggedNodeId]: { ...prev[draggedNodeId], x: Math.max(20, nextX), y: Math.max(20, nextY) },
		}));
	};

	const handleMouseUpCanvas = () => {
		setDraggedNodeId(null);
	};

	// Right-click Context Menu Handler
	const handleContextMenuNode = (e: React.MouseEvent, nodeId: string) => {
		e.preventDefault();
		setSelectedNodeId(nodeId);
		setContextMenu({ x: e.clientX, y: e.clientY, nodeId });
	};

	// Filter templates by category and search
	const filteredTemplates = simulationTemplates.filter((t) => {
		const matchesCat = activeCategory === 'all' || t.category.toLowerCase() === activeCategory.toLowerCase();
		const matchesText = !templateSearch || t.title.toLowerCase().includes(templateSearch.toLowerCase());
		return matchesCat && matchesText;
	});

	return (
		<div
			className="flex flex-col h-[calc(100vh-5rem)] bg-slate-950 text-white font-sans overflow-hidden rounded-2xl border border-slate-800/90 shadow-2xl relative select-none"
			onMouseMove={handleMouseMoveCanvas}
			onMouseUp={handleMouseUpCanvas}
			onClick={() => setContextMenu(null)}
		>
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
								placeholder="Search simulation templates, services, databases, infrastructure..."
								className="w-full bg-transparent text-sm text-white focus:outline-none font-mono"
							/>
							<button onClick={() => setIsCmdKOpen(false)} className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800">
								ESC
							</button>
						</div>

						<div className="space-y-1 max-h-80 overflow-y-auto pr-1">
							{simulationTemplates
								.filter((t) => t.title.toLowerCase().includes(cmdKQuery.toLowerCase()))
								.map((t) => (
									<div
										key={t.id}
										onClick={() => {
											runSimulation(t);
											setIsCmdKOpen(false);
										}}
										className="flex items-center justify-between p-3 rounded-xl hover:bg-cyan-500/10 border border-transparent cursor-pointer transition-all text-xs font-mono"
									>
										<div className="flex items-center gap-2.5">
											<t.icon className="w-4 h-4 text-cyan-400" />
											<div>
												<p className="font-bold text-white">{t.title}</p>
												<p className="text-[10px] text-slate-400">{t.description}</p>
											</div>
										</div>
										<span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-cyan-300 uppercase">
											{t.category}
										</span>
									</div>
								))}
						</div>
					</div>
				</div>
			)}

			{/* Context Menu (Right-Click) Popup */}
			{contextMenu && (
				<div
					className="fixed z-50 bg-slate-900 border border-cyan-500/40 rounded-xl shadow-2xl p-1.5 w-48 font-mono text-xs text-slate-300 space-y-1"
					style={{ top: contextMenu.y, left: contextMenu.x }}
				>
					<button
						onClick={() => runSimulation(simulationTemplates[0])}
						className="w-full text-left px-3 py-1.5 rounded hover:bg-rose-500/20 hover:text-rose-300 flex items-center gap-2"
					>
						<Trash2 className="w-3.5 h-3.5 text-rose-400" /> Delete Component
					</button>
					<button
						onClick={() => runSimulation(simulationTemplates[1])}
						className="w-full text-left px-3 py-1.5 rounded hover:bg-cyan-500/20 hover:text-cyan-300 flex items-center gap-2"
					>
						<Split className="w-3.5 h-3.5 text-cyan-400" /> Split Component
					</button>
					<button
						onClick={() => runSimulation(simulationTemplates[8])}
						className="w-full text-left px-3 py-1.5 rounded hover:bg-emerald-500/20 hover:text-emerald-300 flex items-center gap-2"
					>
						<HardDrive className="w-3.5 h-3.5 text-emerald-400" /> Attach Redis Cache
					</button>
				</div>
			)}

			{/* Top Studio Control Bar */}
			<div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/60 font-mono text-xs shrink-0">
				<div className="flex items-center gap-3">
					<div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
						<Sparkles className="w-4 h-4" />
					</div>
					<div>
						<h1 className="font-black text-white flex items-center gap-2">
							Engineering Simulation Studio
							<span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold">
								FIGMA + MAPS + AI ARCHITECT
							</span>
						</h1>
					</div>
				</div>

				{/* Canvas & Mode Controls */}
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
						<button
							onClick={() => setViewMode('single')}
							className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
								viewMode === 'single'
									? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
									: 'text-slate-400 hover:text-white'
							}`}
						>
							<Square className="w-3.5 h-3.5" /> Single Canvas
						</button>
						<button
							onClick={() => setViewMode('split')}
							className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
								viewMode === 'split'
									? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
									: 'text-slate-400 hover:text-white'
							}`}
						>
							<Columns className="w-3.5 h-3.5 text-cyan-400" /> Dual Split Comparison
						</button>
					</div>

					<div className="flex items-center gap-1 border-l border-slate-800 pl-2">
						<button
							onClick={() => setZoomLevel((z) => Math.min(z + 15, 200))}
							className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
							title="Zoom In"
						>
							<ZoomIn className="w-4 h-4" />
						</button>
						<button
							onClick={() => setZoomLevel((z) => Math.max(z - 15, 50))}
							className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
							title="Zoom Out"
						>
							<ZoomOut className="w-4 h-4" />
						</button>
						<button
							onClick={() => setZoomLevel(100)}
							className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold"
							title="Reset Zoom"
						>
							100%
						</button>
					</div>

					<button
						onClick={() => setIsCmdKOpen(true)}
						className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1.5"
					>
						<Command className="w-3.5 h-3.5 text-cyan-400" /> ⌘K
					</button>
				</div>
			</div>

			{/* ========================================================================= */}
			{/* MAIN 3-PANEL LAYOUT CONTAINER */}
			{/* ========================================================================= */}
			<div className="flex flex-1 overflow-hidden">
				{/* ------------------------------------------------------------------------- */}
				{/* LEFT PANEL: SIMULATION LIBRARY (16 GUIDED WORKFLOWS) */}
				{/* ------------------------------------------------------------------------- */}
				<div className="w-80 border-r border-slate-800/80 bg-slate-950/80 flex flex-col justify-between shrink-0 font-mono">
					{/* Library Header & Search */}
					<div className="p-3 border-b border-slate-800/80 space-y-3">
						<div className="flex items-center justify-between">
							<span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">
								Simulation Library (16)
							</span>
							<span className="text-[10px] text-slate-500 font-bold">GUIDED SCENARIOS</span>
						</div>

						<div className="relative">
							<Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
							<input
								type="text"
								value={templateSearch}
								onChange={(e) => setTemplateSearch(e.target.value)}
								placeholder="Search scenarios..."
								className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
							/>
						</div>

						{/* Category Filters */}
						<div className="flex items-center gap-1 overflow-x-auto scrollbar-none text-[10px]">
							{['all', 'Refactoring', 'Infrastructure', 'Database', 'Optimization'].map((cat) => (
								<button
									key={cat}
									onClick={() => setActiveCategory(cat)}
									className={`px-2 py-0.5 rounded-lg uppercase font-bold whitespace-nowrap transition-all ${
										activeCategory === cat
											? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
											: 'text-slate-400 hover:text-white'
									}`}
								>
									{cat}
								</button>
							))}
						</div>
					</div>

					{/* 16 Guided Templates Cards */}
					<div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
						{filteredTemplates.map((tpl) => (
							<div
								key={tpl.id}
								onClick={() => runSimulation(tpl)}
								className="glass-card rounded-2xl p-3 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer transition-all space-y-1.5 group"
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 group-hover:border-cyan-500/40 transition-colors">
											<tpl.icon className="w-4 h-4" />
										</div>
										<h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors">
											{tpl.title}
										</h4>
									</div>
									<span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 uppercase">
										{tpl.category}
									</span>
								</div>
								<p className="text-[11px] text-slate-400 leading-snug font-sans">{tpl.description}</p>
							</div>
						))}
					</div>
				</div>

				{/* ------------------------------------------------------------------------- */}
				{/* CENTER PANEL: INTERACTIVE ARCHITECTURE CANVAS (SINGLE OR DUAL SPLIT VIEW) */}
				{/* ------------------------------------------------------------------------- */}
				<div className="flex-1 flex flex-col bg-slate-950 font-mono relative overflow-hidden">
					<div className="flex-1 flex overflow-hidden">
						{/* View 1: Current Architecture Canvas */}
						<div
							className={`relative flex-1 bg-slate-950 overflow-hidden ${
								viewMode === 'split' ? 'border-r border-slate-800' : ''
							}`}
						>
							<div className="absolute top-3 left-3 z-10 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-2">
								<span className="w-2 h-2 rounded-full bg-cyan-400" />
								{viewMode === 'split' ? 'Current Architecture' : 'Interactive Architecture Canvas'}
							</div>

							{/* Interactive SVG Node Canvas */}
							<svg
								className="w-full h-full"
								style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center' }}
							>
								<defs>
									<linearGradient id="edgeActive" x1="0%" y1="0%" x2="100%" y2="0%">
										<stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
										<stop offset="100%" stopColor="#818cf8" stopOpacity="0.8" />
									</linearGradient>
									<linearGradient id="edgeRisk" x1="0%" y1="0%" x2="100%" y2="0%">
										<stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
										<stop offset="100%" stopColor="#f43f5e" stopOpacity="0.8" />
									</linearGradient>
								</defs>

								{/* Animated Connections / Edges */}
								{Object.values(nodes).map((n) =>
									n.dependencies.map((depId) => {
										const depNode = nodes[depId];
										if (!depNode) return null;
										const isSelectedEdge = selectedNodeId === n.id || selectedNodeId === depId;

										return (
											<g key={`${n.id}-${depId}`}>
												<line
													x1={n.x}
													y1={n.y}
													x2={depNode.x}
													y2={depNode.y}
													stroke={isSelectedEdge ? 'url(#edgeRisk)' : 'url(#edgeActive)'}
													strokeWidth={isSelectedEdge ? '3' : '1.5'}
													strokeDasharray={n.status === 'risk' ? '4 4' : undefined}
													className={n.status === 'risk' ? 'animate-pulse' : undefined}
												/>
											</g>
										);
									})
								)}

								{/* Interactive Nodes */}
								{Object.values(nodes).map((n) => {
									const isSelected = selectedNodeId === n.id;
									const isHovered = hoveredNodeId === n.id;

									let borderColor = '#38bdf8'; // Active Cyan
									if (n.status === 'added') borderColor = '#34d399'; // Green
									if (n.status === 'removed') borderColor = '#f43f5e'; // Red
									if (n.status === 'risk') borderColor = '#fbbf24'; // Amber

									return (
										<g
											key={n.id}
											onMouseDown={(e) => handleMouseDownNode(e, n.id)}
											onContextMenu={(e) => handleContextMenuNode(e, n.id)}
											onMouseEnter={() => setHoveredNodeId(n.id)}
											onMouseLeave={() => setHoveredNodeId(null)}
											className="cursor-pointer group"
										>
											<circle
												cx={n.x}
												cy={n.y}
												r={isSelected ? 32 : 24}
												fill="#090d16"
												stroke={borderColor}
												strokeWidth={isSelected ? 4 : 2}
												className="transition-all duration-200"
											/>
											{isSelected && (
												<circle cx={n.x} cy={n.y} r="8" fill={borderColor} className="animate-ping opacity-75" />
											)}
											<text
												x={n.x}
												y={n.y + 44}
												textAnchor="middle"
												fill="#e2e8f0"
												fontSize="11"
												fontWeight="bold"
												fontFamily="monospace"
											>
												{n.name}
											</text>
										</g>
									);
								})}
							</svg>

							{/* Mini-map Overlay */}
							<div className="absolute bottom-3 right-3 w-36 h-24 bg-slate-900/90 border border-slate-800 rounded-xl p-2 flex flex-col justify-between shadow-2xl">
								<span className="text-[9px] font-mono text-slate-500 font-bold uppercase">MINI-MAP</span>
								<div className="w-full h-14 border border-cyan-500/30 rounded bg-slate-950 relative">
									<div className="w-5 h-4 border border-cyan-400 bg-cyan-500/20 rounded absolute top-3 left-4" />
								</div>
							</div>
						</div>

						{/* View 2: Proposed Architecture Canvas (Active only in Split View Mode) */}
						{viewMode === 'split' && (
							<div className="relative flex-1 bg-slate-950 overflow-hidden">
								<div className="absolute top-3 left-3 z-10 bg-indigo-950/90 border border-indigo-500/40 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-300 flex items-center gap-2">
									<Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Proposed Architecture (Refactored)
								</div>

								<svg className="w-full h-full" style={{ transform: `scale(${zoomLevel / 100})` }}>
									<line x1="220" y1="160" x2="480" y2="100" stroke="#34d399" strokeWidth="2.5" />
									<line x1="480" y1="100" x2="740" y2="180" stroke="#34d399" strokeWidth="2.5" />
									<line x1="740" y1="180" x2="740" y2="60" stroke="#38bdf8" strokeWidth="2" />

									<circle cx="220" cy="160" r="28" fill="#090d16" stroke="#34d399" strokeWidth="3" />
									<text x="220" y="200" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">
										AuthGateway (Async)
									</text>

									<circle cx="480" cy="100" r="28" fill="#090d16" stroke="#34d399" strokeWidth="3" />
									<text x="480" y="140" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">
										PaymentMicroservice
									</text>

									<circle cx="740" cy="180" r="28" fill="#090d16" stroke="#38bdf8" strokeWidth="2" />
									<text x="740" y="220" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">
										UserDALRepository
									</text>

									<circle cx="740" cy="60" r="28" fill="#090d16" stroke="#fbbf24" strokeWidth="3" />
									<text x="740" y="100" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">
										RedisAuthCache
									</text>
								</svg>

								<div className="absolute bottom-3 left-3 bg-emerald-950/80 border border-emerald-500/40 p-2.5 rounded-xl text-[10px] text-emerald-300 font-mono">
									✓ Direct SQL coupling resolved • Throughput +350%
								</div>
							</div>
						)}
					</div>
				</div>

				{/* ------------------------------------------------------------------------- */}
				{/* RIGHT PANEL: SIMULATION INSPECTOR (METRICS, PREDICTIONS & MIGRATION PLAN) */}
				{/* ------------------------------------------------------------------------- */}
				<div className="w-80 border-l border-slate-800/80 bg-slate-950/90 p-4 flex flex-col justify-between shrink-0 font-mono space-y-4 overflow-y-auto">
					<div className="space-y-4">
						{/* Selection Header */}
						<div className="flex items-center justify-between border-b border-slate-800 pb-3">
							<div>
								<span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider block">
									Component Inspector
								</span>
								<h3 className="text-base font-black text-white mt-0.5">{selectedNode.name}</h3>
							</div>
							<span
								className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase border ${
									selectedNode.status === 'risk'
										? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
										: selectedNode.status === 'added'
											? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
											: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
								}`}
							>
								{selectedNode.status}
							</span>
						</div>

						{/* Health & Complexity Gauges */}
						<div className="grid grid-cols-2 gap-2">
							<div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-center">
								<span className="text-[9px] text-slate-400 uppercase font-bold block">Health Score</span>
								<span className="text-lg font-black text-emerald-400">{selectedNode.health}</span>
							</div>
							<div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-center">
								<span className="text-[9px] text-slate-400 uppercase font-bold block">Complexity</span>
								<span className="text-lg font-black text-cyan-300">{selectedNode.complexity}</span>
							</div>
						</div>

						{/* AI Predictions HUD */}
						<div className="glass-card rounded-2xl p-4 border border-cyan-500/30 bg-slate-900/80 space-y-3">
							<div className="flex items-center justify-between border-b border-slate-800 pb-2">
								<span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
									<Sparkles className="w-3.5 h-3.5 text-cyan-400" /> AI Predictions HUD
								</span>
								<span className="text-[10px] text-emerald-400 font-bold">95.8% CONF</span>
							</div>

							<div className="space-y-2 text-xs">
								<div className="flex justify-between">
									<span className="text-slate-400">Impact Score:</span>
									<span className="font-bold text-white">88 / 100</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Risk Score:</span>
									<span className="font-bold text-amber-400">{selectedNode.riskLevel}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Engineering Effort:</span>
									<span className="font-bold text-cyan-300">2 Days (~14 hrs)</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Affected Files:</span>
									<span className="font-bold text-purple-300">18 Files</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Affected APIs:</span>
									<span className="font-bold text-emerald-300">6 Endpoints</span>
								</div>
							</div>
						</div>

						{/* AI Recommendations */}
						<div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-3 space-y-1.5">
							<span className="text-[9px] font-black text-indigo-300 uppercase block">
								Recommended Migration Strategy
							</span>
							<ol className="list-decimal pl-4 text-[11px] text-slate-300 space-y-1 font-sans">
								<li>Extract inline SQL query calls to Repository DAL handlers</li>
								<li>Deploy Redis Sentinel cluster for session caching</li>
								<li>Run regression test suite across auth integration endpoints</li>
							</ol>
						</div>

						{/* Action Buttons */}
						<div className="space-y-2 pt-2 border-t border-slate-800">
							<Link href="/improve" className="w-full block">
								<Button className="w-full h-8 text-[11px] font-bold bg-cyan-600 hover:bg-cyan-500 text-white gap-1.5">
									<Sparkles className="w-3.5 h-3.5" /> Auto Patch Codebase
								</Button>
							</Link>
							<Link href="/architecture" className="w-full block">
								<Button variant="outline" className="w-full h-8 text-[11px] font-bold bg-slate-900 border-slate-800 text-slate-300 gap-1.5">
									<Building2 className="w-3.5 h-3.5 text-indigo-400" /> Full Architecture View
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* ========================================================================= */}
			{/* BOTTOM PANEL: SIMULATION TIMELINE LOG WITH UNDO & REDO */}
			{/* ========================================================================= */}
			<div className="h-12 border-t border-slate-800 bg-slate-950 font-mono text-[11px] flex items-center justify-between px-5 shrink-0">
				{/* Step History Log */}
				<div className="flex items-center gap-3 overflow-hidden">
					<span className="text-cyan-400 font-bold flex items-center gap-1.5 shrink-0">
						<Activity className="w-3.5 h-3.5 text-cyan-400" /> TIMELINE:
					</span>
					<div className="flex items-center gap-2 overflow-x-auto text-slate-300 shrink-0">
						{history.map((step, idx) => (
							<React.Fragment key={step.id}>
								<span
									className={`px-2 py-0.5 rounded text-[10px] font-bold ${
										idx === historyIndex
											? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
											: 'bg-slate-900 text-slate-500'
									}`}
								>
									{step.title}
								</span>
								{idx < history.length - 1 && <span className="text-slate-600">&gt;</span>}
							</React.Fragment>
						))}
					</div>
				</div>

				{/* Undo / Redo Actions */}
				<div className="flex items-center gap-2 shrink-0">
					<Button
						onClick={handleUndo}
						disabled={historyIndex <= 0}
						size="sm"
						variant="outline"
						className="h-7 text-[10px] font-bold bg-slate-900 border-slate-800 text-slate-300 gap-1"
					>
						<Undo2 className="w-3 h-3 text-cyan-400" /> Undo (Ctrl+Z)
					</Button>
					<Button
						onClick={handleRedo}
						disabled={historyIndex >= history.length - 1}
						size="sm"
						variant="outline"
						className="h-7 text-[10px] font-bold bg-slate-900 border-slate-800 text-slate-300 gap-1"
					>
						<Redo2 className="w-3 h-3 text-indigo-400" /> Redo (Ctrl+Y)
					</Button>
				</div>
			</div>
		</div>
	);
}
