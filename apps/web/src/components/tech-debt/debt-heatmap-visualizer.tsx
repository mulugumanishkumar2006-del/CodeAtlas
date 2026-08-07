'use client';

import * as React from 'react';
import {
	Folder,
	FileCode,
	ChevronRight,
	ZoomIn,
	ZoomOut,
	RotateCcw,
	Sparkles,
	Layers,
	Flame,
	AlertTriangle,
	ShieldAlert,
	CheckCircle2,
	Info,
	X,
	ArrowRight,
	ExternalLink,
	Sliders,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ZoomLevel = 'repository' | 'directory' | 'module' | 'file' | 'class' | 'function';

export interface DebtHeatmapItem {
	id: string;
	name: string;
	path: string;
	level: ZoomLevel;
	debtScore: number; // 0..100
	linesOfCode: number;
	debtType: 'CRITICAL' | 'GROWING' | 'RECENT' | 'LONG_STANDING' | 'ARCHITECTURAL';
	cognitiveComplexity: number;
	couplingScore: number;
	testCoverage: number;
	recentCommits: number;
	hasGodClass?: boolean;
	hasCircularImport?: boolean;
	aiExplanation: string;
	children?: DebtHeatmapItem[];
}

const SAMPLE_HEATMAP_DATA: DebtHeatmapItem[] = [
	{
		id: 'dir-backend',
		name: 'apps/backend',
		path: 'apps/backend',
		level: 'directory',
		debtScore: 78,
		linesOfCode: 28400,
		debtType: 'CRITICAL',
		cognitiveComplexity: 142,
		couplingScore: 84,
		testCoverage: 52,
		recentCommits: 48,
		hasGodClass: true,
		hasCircularImport: true,
		aiExplanation: 'Backend directory contains multiple circular import cycles and two God classes.',
		children: [
			{
				id: 'mod-payment',
				name: 'payment_subsystem',
				path: 'apps/backend/app/payment',
				level: 'module',
				debtScore: 92,
				linesOfCode: 8900,
				debtType: 'CRITICAL',
				cognitiveComplexity: 88,
				couplingScore: 94,
				testCoverage: 42,
				recentCommits: 28,
				hasCircularImport: true,
				aiExplanation: 'Payment processor imports checkout manager causing circular initialization locks.',
				children: [
					{
						id: 'file-processor',
						name: 'processor.ts',
						path: 'apps/backend/app/payment/processor.ts',
						level: 'file',
						debtScore: 95,
						linesOfCode: 1850,
						debtType: 'CRITICAL',
						cognitiveComplexity: 45,
						couplingScore: 98,
						testCoverage: 38,
						recentCommits: 18,
						hasGodClass: true,
						hasCircularImport: true,
						aiExplanation: 'God class processor.ts handles 42 distinct duties with 4 circular imports.',
						children: [
							{
								id: 'class-PaymentProcessor',
								name: 'PaymentProcessor',
								path: 'apps/backend/app/payment/processor.ts#PaymentProcessor',
								level: 'class',
								debtScore: 98,
								linesOfCode: 1400,
								debtType: 'CRITICAL',
								cognitiveComplexity: 38,
								couplingScore: 95,
								testCoverage: 30,
								recentCommits: 14,
								aiExplanation: 'Class contains 18 private fields and tight dependency couplings.',
								children: [
									{
										id: 'fn-executeTransaction',
										name: 'executeTransaction()',
										path: 'apps/backend/app/payment/processor.ts#executeTransaction',
										level: 'function',
										debtScore: 99,
										linesOfCode: 380,
										debtType: 'CRITICAL',
										cognitiveComplexity: 28,
										couplingScore: 90,
										testCoverage: 20,
										recentCommits: 12,
										aiExplanation: 'Nested try-catch blocks with raw SQL fallback and 6 branching levels.',
									},
								],
							},
						],
					},
				],
			},
			{
				id: 'mod-auth',
				name: 'auth_vault',
				path: 'apps/backend/app/auth',
				level: 'module',
				debtScore: 35,
				linesOfCode: 4200,
				debtType: 'RECENT',
				cognitiveComplexity: 22,
				couplingScore: 28,
				testCoverage: 91,
				recentCommits: 8,
				aiExplanation: 'Auth vault is clean with zero circular dependencies.',
			},
		],
	},
	{
		id: 'dir-web',
		name: 'apps/web',
		path: 'apps/web',
		level: 'directory',
		debtScore: 54,
		linesOfCode: 32000,
		debtType: 'GROWING',
		cognitiveComplexity: 78,
		couplingScore: 48,
		testCoverage: 68,
		recentCommits: 34,
		aiExplanation: 'Frontend client is well-typed; debt growing due to deprecated V1 adapter imports.',
		children: [
			{
				id: 'mod-ui',
				name: 'components',
				path: 'apps/web/src/components',
				level: 'module',
				debtScore: 48,
				linesOfCode: 18500,
				debtType: 'LONG_STANDING',
				cognitiveComplexity: 42,
				couplingScore: 35,
				testCoverage: 75,
				recentCommits: 22,
				aiExplanation: 'UI component library follows Tailwind design patterns cleanly.',
			},
		],
	},
];

interface DebtHeatmapVisualizerProps {
	onInspectItem?: (item: DebtHeatmapItem) => void;
}

export function DebtHeatmapVisualizer({ onInspectItem }: DebtHeatmapVisualizerProps) {
	const [currentBreadcrumbs, setCurrentBreadcrumbs] = React.useState<DebtHeatmapItem[]>([]);
	const [activeCategoryFilter, setActiveCategoryFilter] = React.useState<string>('ALL');
	const [hoveredItem, setHoveredItem] = React.useState<DebtHeatmapItem | null>(null);
	const [selectedItemModal, setSelectedItemModal] = React.useState<DebtHeatmapItem | null>(null);

	// Get current active children to display
	const activeItems = React.useMemo(() => {
		if (currentBreadcrumbs.length === 0) {
			return SAMPLE_HEATMAP_DATA;
		}
		const parent = currentBreadcrumbs[currentBreadcrumbs.length - 1];
		return parent.children || [];
	}, [currentBreadcrumbs]);

	const currentLevel = React.useMemo(() => {
		if (currentBreadcrumbs.length === 0) return 'repository';
		return currentBreadcrumbs[currentBreadcrumbs.length - 1].level;
	}, [currentBreadcrumbs]);

	const handleZoomIn = (item: DebtHeatmapItem) => {
		if (item.children && item.children.length > 0) {
			setCurrentBreadcrumbs((prev) => [...prev, item]);
		} else {
			setSelectedItemModal(item);
		}
	};

	const handleBreadcrumbClick = (index: number) => {
		if (index === -1) {
			setCurrentBreadcrumbs([]);
		} else {
			setCurrentBreadcrumbs((prev) => prev.slice(0, index + 1));
		}
	};

	const getDebtTypeColor = (type: DebtHeatmapItem['debtType']) => {
		switch (type) {
			case 'CRITICAL':
				return { bg: 'bg-rose-950/80', border: 'border-rose-500/60', text: 'text-rose-400', badge: 'CRITICAL' };
			case 'GROWING':
				return { bg: 'bg-amber-950/80', border: 'border-amber-500/60', text: 'text-amber-400', badge: 'GROWING' };
			case 'RECENT':
				return { bg: 'bg-cyan-950/80', border: 'border-cyan-500/60', text: 'text-cyan-400', badge: 'RECENT' };
			case 'LONG_STANDING':
				return { bg: 'bg-purple-950/80', border: 'border-purple-500/60', text: 'text-purple-400', badge: 'LONG STANDING' };
			case 'ARCHITECTURAL':
				return { bg: 'bg-indigo-950/80', border: 'border-indigo-500/60', text: 'text-indigo-400', badge: 'COUPLING' };
		}
	};

	return (
		<div className="space-y-6 font-mono">
			{/* Breadcrumb Zoom Bar & Filters */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
				{/* Breadcrumbs Navigation */}
				<div className="flex items-center gap-1.5 flex-wrap text-xs">
					<button
						onClick={() => handleBreadcrumbClick(-1)}
						className={cn(
							'px-2.5 py-1 rounded-lg transition-all font-bold',
							currentBreadcrumbs.length === 0
								? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
								: 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
						)}
					>
						Repository Root
					</button>

					{currentBreadcrumbs.map((crumb, idx) => (
						<React.Fragment key={crumb.id}>
							<ChevronRight className="w-3.5 h-3.5 text-slate-500" />
							<button
								onClick={() => handleBreadcrumbClick(idx)}
								className={cn(
									'px-2.5 py-1 rounded-lg transition-all font-bold',
									idx === currentBreadcrumbs.length - 1
										? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
										: 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
								)}
							>
								{crumb.name}
							</button>
						</React.Fragment>
					))}
				</div>

				{/* Level Indicator Badge */}
				<div className="flex items-center gap-2">
					<span className="text-[10px] text-slate-400 uppercase font-bold">Zoom Level:</span>
					<span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-black uppercase tracking-wider">
						{currentLevel}
					</span>
					{currentBreadcrumbs.length > 0 && (
						<button
							onClick={() => handleBreadcrumbClick(-1)}
							className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
							title="Reset Zoom to Root"
						>
							<RotateCcw className="w-3.5 h-3.5" />
						</button>
					)}
				</div>
			</div>

			{/* Interactive Heatmap Matrix Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{activeItems.map((item) => {
					const colors = getDebtTypeColor(item.debtType);
					const isHovered = hoveredItem?.id === item.id;
					const hasChildren = item.children && item.children.length > 0;

					// Visual size sizing based on LOC
					const locK = (item.linesOfCode / 1000).toFixed(1);

					return (
						<div
							key={item.id}
							onMouseEnter={() => setHoveredItem(item)}
							onMouseLeave={() => setHoveredItem(null)}
							onClick={() => handleZoomIn(item)}
							className={cn(
								'p-5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-xl relative overflow-hidden group',
								colors.bg,
								colors.border,
								isHovered && 'scale-[1.02] shadow-2xl ring-2 ring-cyan-500/40'
							)}
						>
							{/* Top Badges */}
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-2">
									<Folder className="w-4 h-4 text-slate-300" />
									<span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
										{item.name}
									</span>
								</div>
								<span className={cn('px-2 py-0.5 rounded text-[10px] font-black', colors.text)}>
									{colors.badge}
								</span>
							</div>

							{/* Numeric Debt Score & LOC */}
							<div className="flex items-baseline justify-between mt-4">
								<div>
									<span className="text-3xl font-black text-white">{item.debtScore}</span>
									<span className="text-[10px] text-slate-500"> / 100 debt</span>
								</div>
								<span className="text-[10px] text-slate-400 font-mono">{locK}k LOC</span>
							</div>

							{/* Feature Indicators */}
							<div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-800/80">
								{item.hasGodClass && (
									<span className="px-1.5 py-0.5 rounded bg-rose-950 border border-rose-500/40 text-[9px] text-rose-300 font-bold">
										God Class
									</span>
								)}
								{item.hasCircularImport && (
									<span className="px-1.5 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-[9px] text-amber-300 font-bold">
										Circular Cycle
									</span>
								)}
								<span className="text-[10px] text-slate-400 ml-auto font-mono">
									Complexity: {item.cognitiveComplexity}
								</span>
							</div>

							{/* Zoom Trigger Button Footer */}
							<div className="mt-3 pt-2 text-[10px] text-cyan-400 font-bold flex items-center justify-between">
								<span>{hasChildren ? `Zoom into ${item.children?.length} sub-items` : 'Inspect Evidence'}</span>
								<ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
							</div>
						</div>
					);
				})}
			</div>

			{/* Context Hover Panel */}
			{hoveredItem && (
				<div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-2xl flex items-center justify-between text-xs text-slate-200">
					<div className="flex items-center gap-3">
						<Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
						<div>
							<span className="font-bold text-white">AI Debt Reasoning for {hoveredItem.name}:</span>{' '}
							<span className="text-slate-300">{hoveredItem.aiExplanation}</span>
						</div>
					</div>
					<span className="text-cyan-400 font-bold">Click to Zoom Deep-Dive →</span>
				</div>
			)}

			{/* Item Modal Inspect Popup */}
			{selectedItemModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
					<div className="w-full max-w-2xl p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 relative font-mono">
						<button
							onClick={() => setSelectedItemModal(null)}
							className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
						>
							<X className="w-4 h-4" />
						</button>

						<div className="flex items-center gap-3">
							<div className="p-3 rounded-2xl bg-rose-950 border border-rose-500/40 text-rose-300 font-black text-2xl">
								{selectedItemModal.debtScore}
							</div>
							<div>
								<h3 className="text-xl font-black text-white">{selectedItemModal.name}</h3>
								<p className="text-xs text-slate-400">{selectedItemModal.path}</p>
							</div>
						</div>

						<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
							<div>
								<span className="text-[10px] text-slate-400 uppercase">Lines of Code</span>
								<div className="text-lg font-black text-white">{selectedItemModal.linesOfCode}</div>
							</div>
							<div>
								<span className="text-[10px] text-slate-400 uppercase">Cognitive Complexity</span>
								<div className="text-lg font-black text-amber-400">{selectedItemModal.cognitiveComplexity}</div>
							</div>
							<div>
								<span className="text-[10px] text-slate-400 uppercase">Coupling Ratio</span>
								<div className="text-lg font-black text-indigo-400">{selectedItemModal.couplingScore}%</div>
							</div>
							<div>
								<span className="text-[10px] text-slate-400 uppercase">Test Coverage</span>
								<div className="text-lg font-black text-emerald-400">{selectedItemModal.testCoverage}%</div>
							</div>
						</div>

						<div className="space-y-2 p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30">
							<div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
								<Sparkles className="w-4 h-4" /> AI Architectural Explanation
							</div>
							<p className="text-xs text-slate-200 leading-relaxed">
								{selectedItemModal.aiExplanation}
							</p>
						</div>

						<div className="flex items-center justify-between pt-2">
							<Button onClick={() => setSelectedItemModal(null)} variant="outline" className="border-slate-800 text-slate-300">
								Close Inspector
							</Button>
							<Button className="bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-2">
								<span>Investigate Code Evidence</span>
								<ArrowRight className="w-4 h-4" />
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
