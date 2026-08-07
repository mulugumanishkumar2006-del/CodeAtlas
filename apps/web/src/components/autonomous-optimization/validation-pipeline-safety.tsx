'use client';

import * as React from 'react';
import {
	ShieldCheck,
	CheckCircle2,
	AlertCircle,
	RefreshCw,
	Sparkles,
	ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ValidationStage {
	id: string;
	stageName: string;
	status: 'PASSED' | 'FAILED' | 'RUNNING' | 'PENDING';
	durationSeconds: number;
	details: string;
}

const SAMPLE_VALIDATION_STAGES: ValidationStage[] = [
	{ id: 'v-1', stageName: '1. Build & Type Check', status: 'PASSED', durationSeconds: 2.1, details: '0 TypeScript / Python syntax errors' },
	{ id: 'v-2', stageName: '2. Unit & Regression Tests', status: 'PASSED', durationSeconds: 4.8, details: '94/94 test suites passed' },
	{ id: 'v-3', stageName: '3. Security Control Guard', status: 'PASSED', durationSeconds: 1.5, details: 'Zero-trust verification confirmed' },
	{ id: 'v-4', stageName: '4. Architecture Boundary Check', status: 'PASSED', durationSeconds: 1.2, details: 'Zero circular imports detected' },
	{ id: 'v-5', stageName: '5. Performance Simulation', status: 'PASSED', durationSeconds: 3.0, details: 'P99 query latency sub-20ms verified' },
];

export function ValidationPipelineSafety() {
	const [isValidating, setIsValidating] = React.useState(false);

	const handleRunValidation = () => {
		setIsValidating(true);
		setTimeout(() => setIsValidating(false), 1500);
	};

	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">
							<ShieldCheck className="w-4 h-4" /> Multi-Stage Safety Pipeline
						</div>
						<h2 className="text-xl font-black text-white">Automated Validation Pipeline</h2>
						<p className="text-xs text-slate-400">
							Executes build, unit test, security, type checking, & performance validation before applying changes.
						</p>
					</div>

					<Button
						onClick={handleRunValidation}
						disabled={isValidating}
						className={cn(
							'flex items-center gap-2 font-mono text-xs px-4 py-2.5 rounded-xl border shadow-lg transition-all',
							isValidating
								? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
								: 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/30'
						)}
					>
						<RefreshCw className={cn('w-4 h-4', isValidating && 'animate-spin')} />
						<span>{isValidating ? 'Running Validation Suite...' : 'Re-Run Validation Pipeline'}</span>
					</Button>
				</div>
			</div>

			{/* Pipeline Stages Grid */}
			<div className="space-y-3">
				{SAMPLE_VALIDATION_STAGES.map((stg) => (
					<div
						key={stg.id}
						className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center justify-between text-xs"
					>
						<div className="flex items-center gap-3">
							<CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
							<div>
								<h4 className="font-bold text-white">{stg.stageName}</h4>
								<p className="text-[11px] text-slate-400 mt-0.5">{stg.details}</p>
							</div>
						</div>

						<div className="text-right font-mono">
							<span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold block">
								{stg.status}
							</span>
							<span className="text-[10px] text-slate-500 mt-0.5 block">{stg.durationSeconds}s duration</span>
						</div>
					</div>
				))}
			</div>

			{/* Rollback Strategy Card */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-3">
				<h3 className="text-base font-black text-white border-b border-slate-800 pb-3">
					Rollback Strategy & Change Boundaries
				</h3>
				<p className="text-xs text-slate-300">
					If a post-apply regression is detected during automated monitoring, CodeAtlas prepares an instant single-click git rollback commit.
				</p>
			</div>
		</div>
	);
}
