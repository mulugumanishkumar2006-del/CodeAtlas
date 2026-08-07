'use client';

import * as React from 'react';
import {
	GitCommit,
	GitPullRequest,
	Clock,
	Rocket,
	ShieldCheck,
	Activity,
	CheckCircle,
	AlertTriangle,
	ArrowRight,
	Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface FlowStageNode {
	id: string;
	stageName: string;
	averageDurationHours: number;
	status: 'OPTIMAL' | 'NORMAL' | 'BOTTLENECK';
	bottleneckReason?: string;
	evidenceDetails?: string;
	icon: React.ComponentType<any>;
}

const SAMPLE_FLOW_STAGES: FlowStageNode[] = [
	{
		id: 'stg-1',
		stageName: '1. Local Commit',
		averageDurationHours: 1.2,
		status: 'OPTIMAL',
		icon: GitCommit,
		evidenceDetails: 'Small incremental commit frequency verified.',
	},
	{
		id: 'stg-2',
		stageName: '2. PR Creation',
		averageDurationHours: 0.5,
		status: 'OPTIMAL',
		icon: GitPullRequest,
		evidenceDetails: 'PR descriptions include automated architecture impact notes.',
	},
	{
		id: 'stg-3',
		stageName: '3. Code Review Waiting',
		averageDurationHours: 14.5,
		status: 'BOTTLENECK',
		bottleneckReason: 'High Waiting Time! Cross-service PRs experience review delays.',
		evidenceDetails: 'Large cross-module PRs spanning 12+ files wait an average of 14.5 hours for secondary reviewer approval.',
		icon: Clock,
	},
	{
		id: 'stg-4',
		stageName: '4. CI Build & Test',
		averageDurationHours: 0.2,
		status: 'OPTIMAL',
		icon: ShieldCheck,
		evidenceDetails: 'Fast parallel pytest & Next.js build pipeline.',
	},
	{
		id: 'stg-5',
		stageName: '5. Production Deploy',
		averageDurationHours: 0.1,
		status: 'OPTIMAL',
		icon: Rocket,
		evidenceDetails: 'Automated Kubernetes canary deployment.',
	},
];

export function EngineeringFlowMap() {
	const [activeStageId, setActiveStageId] = React.useState<string>('stg-3');
	const activeStage = SAMPLE_FLOW_STAGES.find((s) => s.id === activeStageId) || SAMPLE_FLOW_STAGES[2];

	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div>
					<div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
						<Activity className="w-4 h-4" /> End-to-End Delivery Pipeline Visualization
					</div>
					<h2 className="text-xl font-black text-white">Visual Engineering Flow Map</h2>
					<p className="text-xs text-slate-400">
						Traces the delivery pipeline from Commit → PR → Review → CI Build → Production Deploy to uncover friction.
					</p>
				</div>
			</div>

			{/* Visual Stage Nodes */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
				<div className="flex flex-col lg:flex-row items-center justify-between gap-4">
					{SAMPLE_FLOW_STAGES.map((stage, idx) => {
						const isSelected = stage.id === activeStageId;
						const isBottleneck = stage.status === 'BOTTLENECK';
						const Icon = stage.icon;

						return (
							<React.Fragment key={stage.id}>
								<button
									onClick={() => setActiveStageId(stage.id)}
									className={cn(
										'flex-1 w-full text-left p-4 rounded-2xl border transition-all duration-200 shadow-xl space-y-2 group relative',
										isSelected
											? 'bg-slate-900 border-cyan-500/60 shadow-cyan-950/40 ring-2 ring-cyan-500/30 scale-105'
											: 'bg-slate-950 border-slate-800 hover:border-slate-700',
										isBottleneck && 'border-rose-500/60 bg-rose-950/20'
									)}
								>
									<span className="text-[10px] text-cyan-400 font-bold uppercase block">
										{stage.stageName}
									</span>
									<div className="flex items-center gap-2">
										<Icon className="w-4 h-4 text-slate-300 shrink-0" />
										<h4 className="text-sm font-black text-white">{stage.averageDurationHours} hrs</h4>
									</div>

									{isBottleneck && (
										<span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 text-[9px] font-bold block w-fit">
											⚠️ BOTTLENECK
										</span>
									)}
								</button>

								{idx < SAMPLE_FLOW_STAGES.length - 1 && (
									<ArrowRight className="w-5 h-5 text-slate-600 shrink-0 hidden lg:block" />
								)}
							</React.Fragment>
						);
					})}
				</div>

				{/* Active Stage Inspection Box */}
				<div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
					<div className="flex items-center justify-between border-b border-slate-800 pb-3">
						<h3 className="text-base font-black text-white">{activeStage.stageName} Inspection</h3>
						<span className="text-xs text-cyan-300 font-bold">Avg Waiting Time: {activeStage.averageDurationHours} hrs</span>
					</div>

					{activeStage.bottleneckReason && (
						<div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-1 text-xs">
							<div className="flex items-center gap-2 font-bold text-rose-400">
								<AlertTriangle className="w-4 h-4" /> Detected Pipeline Friction
							</div>
							<p className="text-slate-300">{activeStage.bottleneckReason}</p>
						</div>
					)}

					<div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
						<div className="flex items-center gap-2 font-bold text-cyan-400">
							<Sparkles className="w-4 h-4" /> Observed Telemetry Evidence
						</div>
						<p className="text-slate-300">{activeStage.evidenceDetails}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
