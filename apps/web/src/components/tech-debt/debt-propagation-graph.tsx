'use client';

import * as React from 'react';
import {
	Network,
	Sparkles,
	ArrowRight,
	AlertTriangle,
	ShieldAlert,
	Activity,
	Zap,
	Layers,
	FileCode,
	Info,
	CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface DebtPropagationNode {
	id: string;
	label: string;
	stage: string; // e.g. "Root Cause", "Architectural", "Process Impact", "Production Risk"
	description: string;
	severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
	affectedModulesCount: number;
	icon: React.ComponentType<any>;
}

const PROPAGATION_STAGES: DebtPropagationNode[] = [
	{
		id: 'node-1',
		label: 'Poor Abstraction Boundary',
		stage: '1. Root Cause',
		description: 'PaymentProcessor directly instantiates CheckoutManager without abstract contract interface.',
		severity: 'HIGH',
		affectedModulesCount: 1,
		icon: Layers,
	},
	{
		id: 'node-2',
		label: 'Shared Global State Dependency',
		stage: '2. Shared Dependency',
		description: 'Both services write to shared global transaction memory cache causing race conditions.',
		severity: 'HIGH',
		affectedModulesCount: 3,
		icon: Network,
	},
	{
		id: 'node-3',
		label: 'Tight Circular Coupling',
		stage: '3. Architectural Coupling',
		description: 'Circular import loop prevents independent compilation and mock initialization.',
		severity: 'CRITICAL',
		affectedModulesCount: 6,
		icon: AlertTriangle,
	},
	{
		id: 'node-4',
		label: 'Friction in Automated Testing',
		stage: '4. Testing Friction',
		description: 'Unit test execution requires mocking 14 underlying services; coverage drops to 32%.',
		severity: 'HIGH',
		affectedModulesCount: 8,
		icon: Activity,
	},
	{
		id: 'node-5',
		label: 'Slower Release Velocity',
		stage: '5. Release Friction',
		description: 'Deployment requires all 6 coupled services to be re-tested & deployed simultaneously.',
		severity: 'HIGH',
		affectedModulesCount: 12,
		icon: Zap,
	},
	{
		id: 'node-6',
		label: 'High Incident Risk Exposure',
		stage: '6. Production Risk',
		description: 'Cascading failures during high-traffic checkout flash sales (INC-2026-04).',
		severity: 'CRITICAL',
		affectedModulesCount: 18,
		icon: ShieldAlert,
	},
];

export function DebtPropagationGraph() {
	const [activeNodeId, setActiveNodeId] = React.useState<string>('node-3');
	const [isAnimating, setIsAnimating] = React.useState<boolean>(true);

	const activeNode = PROPAGATION_STAGES.find((n) => n.id === activeNodeId) || PROPAGATION_STAGES[2];

	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
							<Network className="w-4 h-4 animate-pulse" /> Ripple Effect Analyzer
						</div>
						<h2 className="text-xl font-black text-white">Technical Debt Propagation Graph</h2>
						<p className="text-xs text-slate-400">
							Visualizes how architectural debt propagates from root abstraction smells to production incident risks.
						</p>
					</div>

					<Button
						onClick={() => setIsAnimating(!isAnimating)}
						variant="outline"
						className="border-slate-800 text-xs font-mono bg-slate-950 text-slate-300"
					>
						{isAnimating ? 'Pause Flow Animation' : 'Play Flow Animation'}
					</Button>
				</div>
			</div>

			{/* Interactive Horizontal Flow Nodes */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
				<div className="flex flex-col lg:flex-row items-center justify-between gap-4 relative">
					{PROPAGATION_STAGES.map((node, idx) => {
						const isSelected = node.id === activeNodeId;
						const Icon = node.icon;

						return (
							<React.Fragment key={node.id}>
								{/* Stage Card Node */}
								<button
									onClick={() => setActiveNodeId(node.id)}
									className={cn(
										'flex-1 w-full text-left p-4 rounded-2xl border transition-all duration-200 shadow-xl relative group font-mono',
										isSelected
											? 'bg-slate-900 border-cyan-500/60 shadow-cyan-950/40 ring-2 ring-cyan-500/30 scale-105'
											: 'bg-slate-950 border-slate-800 hover:border-slate-700'
									)}
								>
									<span className="text-[10px] text-cyan-400 font-bold uppercase block mb-1">
										{node.stage}
									</span>
									<div className="flex items-center gap-2">
										<Icon className="w-4 h-4 text-slate-300 shrink-0" />
										<h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
											{node.label}
										</h4>
									</div>
									<div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
										<span>Ripple: <strong className="text-white">{node.affectedModulesCount} modules</strong></span>
									</div>
								</button>

								{/* Connector Arrow */}
								{idx < PROPAGATION_STAGES.length - 1 && (
									<div className="hidden lg:flex items-center justify-center shrink-0">
										<ArrowRight
											className={cn(
												'w-5 h-5 text-cyan-400 transition-all',
												isAnimating && 'animate-pulse text-cyan-300 scale-110'
											)}
										/>
									</div>
								)}
							</React.Fragment>
						);
					})}
				</div>

				{/* Active Stage Deep Analysis Card */}
				<div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
					<div className="flex items-center justify-between border-b border-slate-800 pb-3">
						<div className="flex items-center gap-2">
							<span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-bold">
								{activeNode.stage}
							</span>
							<h3 className="text-base font-black text-white">{activeNode.label}</h3>
						</div>
						<span className="text-xs text-rose-400 font-bold">
							Impacts {activeNode.affectedModulesCount} Downstream Modules
						</span>
					</div>

					<p className="text-xs text-slate-300 leading-relaxed">
						{activeNode.description}
					</p>

					<div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
						<span>Remediation Priority: <strong className="text-emerald-400">Fix Upstream Root Cause First</strong></span>
						<span className="text-cyan-400 font-bold">Simulate Fix →</span>
					</div>
				</div>
			</div>
		</div>
	);
}
