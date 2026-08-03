'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
	Search,
	FileCode,
	Cpu,
	Network,
	CheckCircle2,
	RefreshCw,
	Layers,
	Eye,
	Building2,
	BookOpen,
	ArrowRight,
	ExternalLink,
	ZoomIn,
	ZoomOut,
	Maximize2,
	Focus,
	Sparkles,
	Sliders,
	MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IndexingProgress } from '@/components/ui/indexing-progress';

export default function AnalyzeWorkflowPage() {
	const [activeTab, setActiveTab] = useState<'overview' | 'interactive' | 'ast' | 'graph' | 'city'>('overview');
	const [isScanning, setIsScanning] = useState(false);

	// Google Maps Graph State
	const [zoomLevel, setZoomLevel] = useState<number>(100);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [selectedNode, setSelectedNode] = useState<any>({
		id: 'node-auth',
		name: 'AuthGatewayController',
		type: 'Class (FastAPI)',
		file: 'app/api/v1/auth.py',
		complexity: 8.2,
		dependencies: ['JwtService', 'UserRepository', 'RedisCache'],
		incoming: ['RouterProxy', 'SecurityMiddleware'],
	});
	const [focusMode, setFocusMode] = useState<boolean>(false);

	const handleRescan = () => {
		setIsScanning(true);
	};

	const graphNodes = [
		{ id: 'node-auth', name: 'AuthGatewayController', type: 'Class', x: 200, y: 150, color: '#38bdf8' },
		{ id: 'node-jwt', name: 'JwtValidatorService', type: 'Service', x: 450, y: 100, color: '#818cf8' },
		{ id: 'node-user', name: 'UserRepository', type: 'Repository', x: 450, y: 250, color: '#34d399' },
		{ id: 'node-redis', name: 'RedisClusterAdapter', type: 'Database', x: 700, y: 180, color: '#fbbf24' },
		{ id: 'node-audit', name: 'SecurityAuditLogger', type: 'Worker', x: 200, y: 320, color: '#f472b6' },
	];

	return (
		<div className="space-y-6 max-w-7xl mx-auto pb-12">
			{/* Interactive Analysis Experience Modal */}
			{isScanning && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
					<div className="w-full max-w-5xl my-auto">
						<IndexingProgress
							repoName="CodeAtlas Core Engine"
							onComplete={() => setIsScanning(false)}
						/>
					</div>
				</div>
			)}

			{/* Top Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-5">
				<div>
					<div className="flex items-center gap-3">
						<h1 className="text-2xl font-black tracking-tight text-white">Analyze Workflow</h1>
						<span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider">
							CONTINUOUS AST & KNOWLEDGE PARSING
						</span>
					</div>
					<p className="text-xs text-slate-400 mt-1">
						AST code inspection, structural dependency graphs, 3D software city maps, and quality gate metrics.
					</p>
				</div>
				<Button
					onClick={handleRescan}
					className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs gap-2 shadow-lg shadow-cyan-950/50"
				>
					<Sparkles className="h-4 w-4" />
					Trigger Interactive Analysis
				</Button>
			</div>

			{/* Sub-Workflow Navigation Tabs */}
			<div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 overflow-x-auto">
				<button
					onClick={() => setActiveTab('overview')}
					className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
						activeTab === 'overview'
							? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30 shadow-md font-bold'
							: 'text-slate-400 hover:bg-slate-900'
					}`}
				>
					<Search className="h-4 w-4 text-cyan-400" /> Overview & Quality Gates
				</button>
				<button
					onClick={() => setActiveTab('interactive')}
					className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
						activeTab === 'interactive'
							? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30 shadow-md font-bold'
							: 'text-slate-400 hover:bg-slate-900'
					}`}
				>
					<Sparkles className="h-4 w-4 text-emerald-400" /> Interactive Import & Analysis
				</button>
				<button
					onClick={() => setActiveTab('ast')}
					className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
						activeTab === 'ast'
							? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30 shadow-md font-bold'
							: 'text-slate-400 hover:bg-slate-900'
					}`}
				>
					<FileCode className="h-4 w-4 text-indigo-400" /> AST Code Inspector
				</button>
				<button
					onClick={() => setActiveTab('graph')}
					className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
						activeTab === 'graph'
							? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30 shadow-md font-bold'
							: 'text-slate-400 hover:bg-slate-900'
					}`}
				>
					<Network className="h-4 w-4 text-emerald-400" /> Google-Maps Dependency Graph
				</button>
				<button
					onClick={() => setActiveTab('city')}
					className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
						activeTab === 'city'
							? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30 shadow-md font-bold'
							: 'text-slate-400 hover:bg-slate-900'
					}`}
				>
					<Building2 className="h-4 w-4 text-purple-400" /> Software City 3D Topology
				</button>
			</div>

			{/* TAB CONTENT: Interactive Import & Analysis */}
			{activeTab === 'interactive' && (
				<div className="py-2">
					<IndexingProgress repoName="CodeAtlas Core Engine" />
				</div>
			)}

			{/* TAB CONTENT: Overview */}
			{activeTab === 'overview' && (
				<div className="space-y-6">
					<div className="grid gap-4 md:grid-cols-3">
						<div className="glass-card rounded-2xl p-5 space-y-2">
							<span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono">
								Incremental AST Indexer
							</span>
							<h3 className="text-2xl font-black text-white">115 ms Sync</h3>
							<p className="text-xs text-slate-400">
								Sub-120ms delta tree parser watching 35 repository files in real-time.
							</p>
						</div>
						<div className="glass-card rounded-2xl p-5 space-y-2">
							<span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
								Quality Gates Status
							</span>
							<h3 className="text-2xl font-black text-emerald-400">4 / 4 PASSED</h3>
							<p className="text-xs text-slate-400">
								Clean Architecture, SOC2 Policy, Coverage & Zero Vulnerability gates satisfied.
							</p>
						</div>
						<div className="glass-card rounded-2xl p-5 space-y-2">
							<span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider font-mono">
								Knowledge Graph Nodes
							</span>
							<h3 className="text-2xl font-black text-white">1,420 AST Entities</h3>
							<p className="text-xs text-slate-400">
								Classes, functions, microservices, and database relations cataloged.
							</p>
						</div>
					</div>
				</div>
			)}

			{/* TAB CONTENT: Google-Maps Style Graph Canvas */}
			{(activeTab === 'graph' || activeTab === 'overview') && (
				<div className="glass-card rounded-2xl p-5 border border-slate-800/80 space-y-4">
					{/* Maps Toolbar Header */}
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800/80 pb-3">
						{/* Breadcrumb Path Trace */}
						<div className="flex items-center gap-2 text-xs font-mono text-slate-400">
							<span className="text-cyan-400 font-bold">CodeAtlas</span>
							<span>&gt;</span>
							<span>AuthGateway</span>
							<span>&gt;</span>
							<span className="text-white font-bold">{selectedNode.name}</span>
						</div>

						{/* Controls Bar */}
						<div className="flex items-center gap-2">
							{/* Node Search Bar */}
							<div className="relative">
								<Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
								<input
									type="text"
									placeholder="Search nodes..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="px-2.5 py-1 pl-8 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono w-40"
								/>
							</div>

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
								className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
								title="Fit to Screen"
							>
								<Maximize2 className="w-4 h-4" />
							</button>
							<button
								onClick={() => setFocusMode(!focusMode)}
								className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold flex items-center gap-1 ${
									focusMode
										? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
										: 'bg-slate-900 text-slate-400 border-slate-800'
								}`}
							>
								<Focus className="w-3.5 h-3.5" /> Focus Mode
							</button>
						</div>
					</div>

					{/* Graph Canvas Container */}
					<div className="relative w-full h-[420px] bg-slate-950 rounded-xl overflow-hidden border border-slate-900">
						{/* Animated SVG Graph Map */}
						<svg
							className="w-full h-full"
							style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center' }}
						>
							<defs>
								<linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
									<stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
									<stop offset="100%" stopColor="#818cf8" stopOpacity="0.8" />
								</linearGradient>
							</defs>

							{/* Edges */}
							<line x1="200" y1="150" x2="450" y2="100" stroke="url(#edgeGrad)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
							<line x1="200" y1="150" x2="450" y2="250" stroke="url(#edgeGrad)" strokeWidth="2" />
							<line x1="450" y1="100" x2="700" y2="180" stroke="url(#edgeGrad)" strokeWidth="2" />
							<line x1="200" y1="150" x2="200" y2="320" stroke="url(#edgeGrad)" strokeWidth="2" />

							{/* Interactive Graph Nodes */}
							{graphNodes.map((node) => {
								const isSelected = selectedNode?.id === node.id;
								return (
									<g
										key={node.id}
										onClick={() =>
											setSelectedNode({
												id: node.id,
												name: node.name,
												type: `${node.type} (AST)`,
												file: `app/services/${node.name.toLowerCase()}.py`,
												complexity: 6.5,
												dependencies: ['CoreDatabase', 'LoggingService'],
												incoming: ['RouterController'],
											})
										}
										className="cursor-pointer group"
									>
										<circle
											cx={node.x}
											cy={node.y}
											r={isSelected ? 26 : 20}
											fill="#090d16"
											stroke={node.color}
											strokeWidth={isSelected ? 4 : 2}
											className="transition-all duration-300"
										/>
										<circle
											cx={node.x}
											cy={node.y}
											r="6"
											fill={node.color}
											className="animate-ping opacity-60"
										/>
										<text
											x={node.x}
											y={node.y + 38}
											textAnchor="middle"
											fill="#e2e8f0"
											fontSize="11"
											fontWeight="bold"
											fontFamily="monospace"
										>
											{node.name}
										</text>
									</g>
								);
							})}
						</svg>

						{/* Minimap Overlay Box */}
						<div className="absolute bottom-3 right-3 w-32 h-20 bg-slate-900/90 border border-slate-800 rounded-lg p-1.5 flex flex-col justify-between shadow-xl">
							<span className="text-[9px] font-mono text-slate-500 font-bold uppercase">MINIMAP</span>
							<div className="w-full h-10 border border-cyan-500/30 rounded bg-slate-950/60 relative">
								<div className="w-4 h-3 border border-cyan-400 bg-cyan-500/20 rounded absolute top-2 left-3" />
							</div>
						</div>

						{/* Selected Node Inspector Drawer */}
						{selectedNode && (
							<div className="absolute top-3 left-3 w-64 glass-card rounded-xl p-3.5 space-y-2 border border-cyan-500/40 text-xs font-mono">
								<div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
									<span className="font-black text-cyan-400">{selectedNode.name}</span>
									<span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
										{selectedNode.type}
									</span>
								</div>
								<p className="text-[10px] text-slate-400 truncate">File: {selectedNode.file}</p>
								<div className="flex justify-between text-[10px] pt-1">
									<span className="text-slate-400">Cyclomatic:</span>
									<span className="font-bold text-emerald-400">{selectedNode.complexity}</span>
								</div>
								<div className="text-[10px] space-y-1">
									<span className="text-slate-400 block font-bold">Outgoing Dependencies:</span>
									<div className="flex flex-wrap gap-1">
										{selectedNode.dependencies?.map((dep: string, i: number) => (
											<span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[9px]">
												{dep}
											</span>
										))}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
