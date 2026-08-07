'use client';

import * as React from 'react';
import {
	Zap,
	Sparkles,
	Clock,
	CheckCircle,
	ArrowRight,
	FileCode,
	CheckSquare,
	Layers,
	ShieldCheck,
	ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface QuickWinItem {
	id: string;
	title: string;
	category: string;
	estimatedEffort: string; // e.g. "1 hr", "2 hrs"
	expectedScoreGain: number; // e.g. +4.5
	risk: 'LOW' | 'MEDIUM';
	affectedFiles: string[];
	aiExplanation: string;
}

const SAMPLE_QUICK_WINS: QuickWinItem[] = [
	{
		id: 'qw-1',
		title: 'Parametrize Dynamic Raw SQL in analytics_raw.py',
		category: 'Security Parameterization',
		estimatedEffort: '2 hrs',
		expectedScoreGain: 4.8,
		risk: 'LOW',
		affectedFiles: ['apps/backend/app/db/queries/analytics_raw.py'],
		aiExplanation: 'Replaces raw string formatting with SQLAlchemy bound parameters. Eliminates SQL injection risk instantly.',
	},
	{
		id: 'qw-2',
		title: 'Purge Deprecated Legacy V1 Adapter Exports',
		category: 'Dead Code Removal',
		estimatedEffort: '1 hr',
		expectedScoreGain: 2.5,
		risk: 'LOW',
		affectedFiles: ['src/legacy/v1_adapter.ts', 'src/index.ts'],
		aiExplanation: 'Deletes 430 lines of zero-referenced legacy adapter code, shrinking bundle size by 180KB.',
	},
	{
		id: 'qw-3',
		title: 'Consolidate Duplicate JWT Parsing Helpers',
		category: 'Code Deduplication',
		estimatedEffort: '3 hrs',
		expectedScoreGain: 3.8,
		risk: 'LOW',
		affectedFiles: ['packages/auth-utils/src/jwt.ts', 'apps/backend/app/auth/utils.py'],
		aiExplanation: 'Consolidates 4 copy-pasted JWT parsing helpers into @codeatlas/auth-core shared package.',
	},
];

export function QuickWinsDetector() {
	const [appliedIds, setAppliedIds] = React.useState<string[]>([]);

	const handleApplyQuickWin = (id: string) => {
		setAppliedIds((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
		);
	};

	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">
						<Zap className="w-4 h-4 fill-emerald-400" /> High-Impact Low-Effort Remediation
					</div>
					<h2 className="text-xl font-black text-white">Automated Quick Win Detector</h2>
					<p className="text-xs text-slate-400">
						Identified high-leverage refactorings that deliver immediate score gains with minimal effort.
					</p>
				</div>

				<div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-black text-sm">
					<span>{SAMPLE_QUICK_WINS.length} Quick Wins Available</span>
				</div>
			</div>

			{/* Quick Wins Feed */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{SAMPLE_QUICK_WINS.map((win) => {
					const isApplied = appliedIds.includes(win.id);
					return (
						<div
							key={win.id}
							className={cn(
								'p-5 rounded-3xl border transition-all duration-200 shadow-xl space-y-4 flex flex-col justify-between',
								isApplied
									? 'bg-slate-950/60 border-slate-800 opacity-60'
									: 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
							)}
						>
							<div className="space-y-2">
								<div className="flex items-center justify-between text-xs">
									<span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
										+{win.expectedScoreGain} PTS GAIN
									</span>
									<span className="text-purple-400 font-bold flex items-center gap-1">
										<Clock className="w-3.5 h-3.5" /> {win.estimatedEffort}
									</span>
								</div>

								<h4 className="text-xs font-bold text-white leading-snug">{win.title}</h4>

								<p className="text-[11px] text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
									{win.aiExplanation}
								</p>
							</div>

							<div className="pt-3 border-t border-slate-800 space-y-3">
								<div className="text-[10px] text-slate-500 font-mono">
									Target: <strong className="text-slate-300">{win.affectedFiles[0]}</strong>
								</div>

								<Button
									onClick={() => handleApplyQuickWin(win.id)}
									className={cn(
										'w-full font-mono text-xs py-2 rounded-xl flex items-center justify-center gap-2 transition-all',
										isApplied
											? 'bg-slate-800 text-slate-400 border border-slate-700'
											: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'
									)}
								>
									{isApplied ? (
										<>
											<CheckCircle className="w-4 h-4 text-emerald-400" />
											<span>Applied to Workspace</span>
										</>
									) : (
										<>
											<Sparkles className="w-4 h-4" />
											<span>Apply Quick Win Fix</span>
										</>
									)}
								</Button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
