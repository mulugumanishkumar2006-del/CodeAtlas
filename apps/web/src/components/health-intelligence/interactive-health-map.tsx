'use client';

import * as React from 'react';
import {
	Folder,
	FileCode,
	AlertTriangle,
	CheckCircle,
	AlertOctagon,
	Sparkles,
	Layers,
	ShieldAlert,
	Info,
	Search,
	Filter,
	Eye,
	X,
	ArrowRight,
	ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ModuleHealthNode {
	id: string;
	name: string;
	path: string;
	healthScore: number;
	status: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'DEPRECATED' | 'HIGH_RISK';
	filesCount: number;
	linesOfCode: number;
	circularDepsCount: number;
	techDebtHours: number;
	maintainabilityIndex: number;
	aiRecommendation: string;
	primaryLanguage: string;
}

const MODULE_NODES: ModuleHealthNode[] = [
	{
		id: 'mod-1',
		name: 'auth-vault',
		path: 'apps/backend/app/auth',
		healthScore: 92,
		status: 'HEALTHY',
		filesCount: 14,
		linesOfCode: 2450,
		circularDepsCount: 0,
		techDebtHours: 12,
		maintainabilityIndex: 88,
		aiRecommendation: 'Architecture is pristine. Continue enforcing automated unit tests.',
		primaryLanguage: 'Python',
	},
	{
		id: 'mod-2',
		name: 'payment-processor',
		path: 'apps/backend/app/payment',
		healthScore: 58,
		status: 'CRITICAL',
		filesCount: 28,
		linesOfCode: 8900,
		circularDepsCount: 4,
		techDebtHours: 145,
		maintainabilityIndex: 42,
		aiRecommendation: 'High circular coupling between PaymentProcessor and CheckoutManager. Break cycle immediately.',
		primaryLanguage: 'TypeScript',
	},
	{
		id: 'mod-3',
		name: 'analytics-engine',
		path: 'apps/backend/app/analytics',
		healthScore: 68,
		status: 'WARNING',
		filesCount: 22,
		linesOfCode: 5600,
		circularDepsCount: 1,
		techDebtHours: 68,
		maintainabilityIndex: 61,
		aiRecommendation: 'Sanitize raw SQL queries and parametrize user search parameters.',
		primaryLanguage: 'Python',
	},
	{
		id: 'mod-4',
		name: 'legacy-v1-api',
		path: 'apps/backend/app/api/v1/legacy',
		healthScore: 35,
		status: 'DEPRECATED',
		filesCount: 18,
		linesOfCode: 4200,
		circularDepsCount: 3,
		techDebtHours: 210,
		maintainabilityIndex: 30,
		aiRecommendation: 'Deprecated v1 API. Schedule complete removal to reclaim 180KB bundle space.',
		primaryLanguage: 'TypeScript',
	},
	{
		id: 'mod-5',
		name: 'ai-reasoning-engine',
		path: 'apps/backend/app/ai',
		healthScore: 89,
		status: 'HEALTHY',
		filesCount: 35,
		linesOfCode: 12400,
		circularDepsCount: 0,
		techDebtHours: 28,
		maintainabilityIndex: 85,
		aiRecommendation: 'Highly performant streaming pipeline with good type coverage.',
		primaryLanguage: 'Python',
	},
	{
		id: 'mod-6',
		name: 'order-processing',
		path: 'apps/backend/app/order',
		healthScore: 52,
		status: 'HIGH_RISK',
		filesCount: 19,
		linesOfCode: 6800,
		circularDepsCount: 2,
		techDebtHours: 110,
		maintainabilityIndex: 48,
		aiRecommendation: 'God class detected in order engine. Extract validator and notification handlers.',
		primaryLanguage: 'TypeScript',
	},
	{
		id: 'mod-7',
		name: 'knowledge-graph',
		path: 'apps/backend/app/knowledge',
		healthScore: 86,
		status: 'HEALTHY',
		filesCount: 24,
		linesOfCode: 7100,
		circularDepsCount: 0,
		techDebtHours: 22,
		maintainabilityIndex: 82,
		aiRecommendation: 'Graph search indexes are optimal. Maintain continuous benchmark sweeps.',
		primaryLanguage: 'Python',
	},
	{
		id: 'mod-8',
		name: 'web-frontend-components',
		path: 'apps/web/src/components',
		healthScore: 84,
		status: 'HEALTHY',
		filesCount: 42,
		linesOfCode: 14500,
		circularDepsCount: 0,
		techDebtHours: 35,
		maintainabilityIndex: 80,
		aiRecommendation: 'Clean component structure with modern Tailwind styling.',
		primaryLanguage: 'TypeScript React',
	},
];

interface InteractiveHealthMapProps {
	onInspectModule?: (module: ModuleHealthNode) => void;
}

export function InteractiveHealthMap({ onInspectModule }: InteractiveHealthMapProps) {
	const [statusFilter, setStatusFilter] = React.useState<string>('ALL');
	const [hoveredNode, setHoveredNode] = React.useState<ModuleHealthNode | null>(null);
	const [selectedNodeModal, setSelectedNodeModal] = React.useState<ModuleHealthNode | null>(null);

	const filteredNodes = MODULE_NODES.filter(
		(node) => statusFilter === 'ALL' || node.status === statusFilter
	);

	const getStatusColor = (status: ModuleHealthNode['status']) => {
		switch (status) {
			case 'HEALTHY':
				return { bg: 'bg-emerald-950/80', border: 'border-emerald-500/60', text: 'text-emerald-400', hex: '#10b981' };
			case 'WARNING':
				return { bg: 'bg-amber-950/80', border: 'border-amber-500/60', text: 'text-amber-400', hex: '#f59e0b' };
			case 'CRITICAL':
				return { bg: 'bg-rose-950/80', border: 'border-rose-500/60', text: 'text-rose-400', hex: '#ef4444' };
			case 'HIGH_RISK':
				return { bg: 'bg-orange-950/80', border: 'border-orange-500/60', text: 'text-orange-400', hex: '#f97316' };
			case 'DEPRECATED':
				return { bg: 'bg-purple-950/80', border: 'border-purple-500/60', text: 'text-purple-400', hex: '#a855f7' };
		}
	};

	return (
		<div className="space-y-6 font-mono relative">
			{/* Controls Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
				<div>
					<h3 className="text-lg font-black text-white flex items-center gap-2">
						<Layers className="w-5 h-5 text-cyan-400" /> Interactive Repository Module Health Map
					</h3>
					<p className="text-xs text-slate-400">
						Visual color-coded matrix of repository sub-systems. Hover or click modules for diagnostics.
					</p>
				</div>

				{/* Filter Pills */}
				<div className="flex flex-wrap items-center gap-1.5">
					{['ALL', 'HEALTHY', 'WARNING', 'CRITICAL', 'HIGH_RISK', 'DEPRECATED'].map((s) => (
						<button
							key={s}
							onClick={() => setStatusFilter(s)}
							className={cn(
								'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
								statusFilter === s
									? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-950'
									: 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
							)}
						>
							{s}
						</button>
					))}
				</div>
			</div>

			{/* Module Grid Heatmap Visualizer */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{filteredNodes.map((node) => {
					const colors = getStatusColor(node.status);
					const isHovered = hoveredNode?.id === node.id;

					return (
						<div
							key={node.id}
							onMouseEnter={() => setHoveredNode(node)}
							onMouseLeave={() => setHoveredNode(null)}
							onClick={() => setSelectedNodeModal(node)}
							className={cn(
								'p-5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-xl relative overflow-hidden group',
								colors.bg,
								colors.border,
								isHovered && 'scale-[1.02] shadow-2xl ring-2 ring-cyan-500/40'
							)}
						>
							{/* Header */}
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-2">
									<Folder className="w-4 h-4 text-slate-300" />
									<span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
										{node.name}
									</span>
								</div>
								<span className={cn('px-2 py-0.5 rounded text-[10px] font-black', colors.text)}>
									{node.status}
								</span>
							</div>

							{/* Score */}
							<div className="flex items-baseline justify-between mt-4">
								<div className="flex items-baseline gap-1">
									<span className="text-3xl font-black text-white">{node.healthScore}</span>
									<span className="text-[10px] text-slate-400">/ 100</span>
								</div>
								<span className="text-[10px] text-slate-400">{node.primaryLanguage}</span>
							</div>

							{/* Quick Metrics Bar */}
							<div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
								<div>
									Files: <strong className="text-white">{node.filesCount}</strong>
								</div>
								<div>
									LOC: <strong className="text-white">{(node.linesOfCode / 1000).toFixed(1)}k</strong>
								</div>
								<div>
									Circular: <strong className={node.circularDepsCount > 0 ? 'text-rose-400' : 'text-emerald-400'}>{node.circularDepsCount}</strong>
								</div>
								<div>
									Debt: <strong className="text-amber-400">{node.techDebtHours}h</strong>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Interactive Hover Diagnostic Cards */}
			{hoveredNode && (
				<div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-2xl flex items-center justify-between text-xs text-slate-200">
					<div className="flex items-center gap-3">
						<Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
						<div>
							<span className="font-bold text-white">AI Diagnostics for {hoveredNode.name}:</span>{' '}
							<span className="text-slate-300">{hoveredNode.aiRecommendation}</span>
						</div>
					</div>
					<span className="text-cyan-400 font-bold">Click for Full Subsystem Inspection →</span>
				</div>
			)}

			{/* Detailed Module Modal Popup */}
			{selectedNodeModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
					<div className="w-full max-w-2xl p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 relative font-mono">
						<button
							onClick={() => setSelectedNodeModal(null)}
							className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
						>
							<X className="w-4 h-4" />
						</button>

						<div className="flex items-center gap-3">
							<div className="p-3 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-black text-2xl">
								{selectedNodeModal.healthScore}
							</div>
							<div>
								<h3 className="text-xl font-black text-white">{selectedNodeModal.name}</h3>
								<p className="text-xs text-slate-400">{selectedNodeModal.path}</p>
							</div>
						</div>

						<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
							<div>
								<span className="text-[10px] text-slate-400 uppercase">Files</span>
								<div className="text-lg font-black text-white">{selectedNodeModal.filesCount}</div>
							</div>
							<div>
								<span className="text-[10px] text-slate-400 uppercase">Lines of Code</span>
								<div className="text-lg font-black text-white">{selectedNodeModal.linesOfCode}</div>
							</div>
							<div>
								<span className="text-[10px] text-slate-400 uppercase">Circular Imports</span>
								<div className="text-lg font-black text-rose-400">{selectedNodeModal.circularDepsCount}</div>
							</div>
							<div>
								<span className="text-[10px] text-slate-400 uppercase">Tech Debt</span>
								<div className="text-lg font-black text-amber-400">{selectedNodeModal.techDebtHours} hrs</div>
							</div>
						</div>

						<div className="space-y-2 p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30">
							<div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
								<Sparkles className="w-4 h-4" /> AI CTO Subsystem Recommendation
							</div>
							<p className="text-xs text-slate-200 leading-relaxed">
								{selectedNodeModal.aiRecommendation}
							</p>
						</div>

						<div className="flex items-center justify-between pt-2">
							<Button
								onClick={() => setSelectedNodeModal(null)}
								variant="outline"
								className="border-slate-800 text-slate-300"
							>
								Close Modal
							</Button>
							<Button className="bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-2">
								<span>Deep-Dive Module Code</span>
								<ArrowRight className="w-4 h-4" />
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
