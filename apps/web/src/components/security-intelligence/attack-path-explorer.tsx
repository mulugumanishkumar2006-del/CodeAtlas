'use client';

import * as React from 'react';
import {
	ShieldAlert,
	Globe,
	Lock,
	Server,
	Database,
	Key,
	ArrowRight,
	Sparkles,
	CheckCircle,
	AlertTriangle,
	Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface AttackPathStep {
	id: string;
	stepNumber: number;
	layerName: string; // e.g. "1. External Entry Point"
	componentName: string;
	boundaryType: string;
	vulnerabilityDetails: string;
	defensiveMitigation: string;
	icon: React.ComponentType<any>;
	isVulnerableNode?: boolean;
}

const SAMPLE_ATTACK_PATH: AttackPathStep[] = [
	{
		id: 'ap-1',
		stepNumber: 1,
		layerName: '1. External Entry Point',
		componentName: 'HTTPS Public API Edge',
		boundaryType: 'Public Internet Boundary',
		vulnerabilityDetails: 'Publicly reachable POST /api/v1/analytics/query endpoint.',
		defensiveMitigation: 'Enforce rate limiting and Cloudflare Web Application Firewall (WAF) rule sets.',
		icon: Globe,
	},
	{
		id: 'ap-2',
		stepNumber: 2,
		layerName: '2. API Gateway & Auth',
		componentName: 'JWT Auth Vault Gateway',
		boundaryType: 'Zero-Trust Auth Boundary',
		vulnerabilityDetails: 'Validates JWT signature cleanly.',
		defensiveMitigation: 'Enforce token expiry rotation and fine-grained OAuth2 scopes.',
		icon: Lock,
	},
	{
		id: 'ap-3',
		stepNumber: 3,
		layerName: '3. Vulnerable Service Module',
		componentName: 'analytics_raw.py Handler',
		boundaryType: 'Internal Microservice VPC',
		vulnerabilityDetails: 'Receives user query filter parameter and formats raw SQL query string unescaped.',
		defensiveMitigation: 'Parameterize raw SQL bindings in SQLAlchemy query context.',
		icon: Server,
		isVulnerableNode: true,
	},
	{
		id: 'ap-4',
		stepNumber: 4,
		layerName: '4. Target Database Store',
		componentName: 'PostgreSQL Multitenant DB',
		boundaryType: 'Encrypted Data Store Boundary',
		vulnerabilityDetails: 'Executes unescaped query on analytics tables containing sensitive tenant metrics.',
		defensiveMitigation: 'Apply database row-level security (RLS) policies.',
		icon: Database,
	},
];

export function AttackPathExplorer() {
	const [activeStepId, setActiveStepId] = React.useState<string>('ap-3');
	const activeStep = SAMPLE_ATTACK_PATH.find((s) => s.id === activeStepId) || SAMPLE_ATTACK_PATH[2];

	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div>
					<div className="flex items-center gap-2 text-xs text-rose-400 font-bold uppercase tracking-wider mb-1">
						<ShieldAlert className="w-4 h-4" /> Defensive Attack Path Visualization
					</div>
					<h2 className="text-xl font-black text-white">Attack Path & Exposure Explorer</h2>
					<p className="text-xs text-slate-400">
						Traces potential entry points, trust boundaries, and vulnerable services to establish defensive mitigations.
					</p>
				</div>
			</div>

			{/* Attack Path Visual Nodes Flow */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
				<div className="flex flex-col lg:flex-row items-center justify-between gap-4">
					{SAMPLE_ATTACK_PATH.map((step, idx) => {
						const isSelected = step.id === activeStepId;
						const Icon = step.icon;

						return (
							<React.Fragment key={step.id}>
								<button
									onClick={() => setActiveStepId(step.id)}
									className={cn(
										'flex-1 w-full text-left p-4 rounded-2xl border transition-all duration-200 shadow-xl space-y-2 group relative',
										isSelected
											? 'bg-slate-900 border-cyan-500/60 shadow-cyan-950/40 ring-2 ring-cyan-500/30 scale-105'
											: 'bg-slate-950 border-slate-800 hover:border-slate-700'
									)}
								>
									<span className="text-[10px] text-cyan-400 font-bold uppercase block">
										{step.layerName}
									</span>
									<div className="flex items-center gap-2">
										<Icon className="w-4 h-4 text-slate-300 shrink-0" />
										<h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
											{step.componentName}
										</h4>
									</div>

									{step.isVulnerableNode && (
										<span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 text-[9px] font-bold block w-fit">
											⚠️ VULNERABILITY NODE
										</span>
									)}
								</button>

								{idx < SAMPLE_ATTACK_PATH.length - 1 && (
									<ArrowRight className="w-5 h-5 text-slate-600 shrink-0 hidden lg:block" />
								)}
							</React.Fragment>
						);
					})}
				</div>

				{/* Active Step Mitigation Overlay */}
				<div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
					<div className="flex items-center justify-between border-b border-slate-800 pb-3">
						<div className="flex items-center gap-2">
							<span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-bold">
								{activeStep.layerName}
							</span>
							<h3 className="text-base font-black text-white">{activeStep.componentName}</h3>
						</div>
						<span className="text-xs text-slate-400 font-mono">Boundary: {activeStep.boundaryType}</span>
					</div>

					<p className="text-xs text-slate-300">{activeStep.vulnerabilityDetails}</p>

					<div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
						<div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
							<CheckCircle className="w-4 h-4" /> Defensive Mitigation Requirement
						</div>
						<p className="text-xs text-slate-300">{activeStep.defensiveMitigation}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
