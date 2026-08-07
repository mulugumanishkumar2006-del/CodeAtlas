'use client';

import * as React from 'react';
import {
	Code2,
	Sparkles,
	CheckCircle,
	XCircle,
	Undo2,
	ShieldCheck,
	ArrowRight,
	FileCode,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function IsolatedWorkspaceDiff() {
	const [approvalState, setApprovalState] = React.useState<'PENDING' | 'ACCEPTED' | 'REJECTED'>('PENDING');

	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
							<Code2 className="w-4 h-4" /> Isolated Change Workspace
						</div>
						<h2 className="text-xl font-black text-white">Proposed Patch Diff Inspector</h2>
						<p className="text-xs text-slate-400">
							Review generated minimal changes before developer approval and validation pipeline execution.
						</p>
					</div>

					<div className="flex items-center gap-2">
						{approvalState === 'PENDING' && (
							<>
								<Button
									onClick={() => setApprovalState('ACCEPTED')}
									className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono px-4 py-2 rounded-xl flex items-center gap-1.5"
								>
									<CheckCircle className="w-4 h-4" /> Accept Patch
								</Button>
								<Button
									onClick={() => setApprovalState('REJECTED')}
									className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono px-4 py-2 rounded-xl flex items-center gap-1.5"
								>
									<XCircle className="w-4 h-4" /> Reject Patch
								</Button>
							</>
						)}

						{approvalState !== 'PENDING' && (
							<Button
								onClick={() => setApprovalState('PENDING')}
								className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono px-4 py-2 rounded-xl flex items-center gap-1.5"
							>
								<Undo2 className="w-4 h-4" /> Reset Decision
							</Button>
						)}
					</div>
				</div>
			</div>

			{/* Side-by-Side Diff Viewer */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
					<span className="font-bold text-white">File: apps/backend/app/db/queries/analytics_raw.py</span>
					<span className="text-slate-400 font-mono">Added 1 Index Guard</span>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
					{/* Original */}
					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
						<span className="text-rose-400 font-bold uppercase text-[10px] block">BEFORE (Original)</span>
						<pre className="text-slate-400 leading-relaxed overflow-x-auto p-2 bg-slate-900/60 rounded-xl text-[11px]">
{`def query_metrics(tenant_id: str, filter_val: str):
    # Raw SQL without index hint
    return db.execute(
        f"SELECT * FROM metrics WHERE tenant_id='{tenant_id}' AND filter='{filter_val}'"
    )`}
						</pre>
					</div>

					{/* Proposed */}
					<div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-2">
						<span className="text-emerald-400 font-bold uppercase text-[10px] block">AFTER (Proposed Patch)</span>
						<pre className="text-emerald-300 leading-relaxed overflow-x-auto p-2 bg-slate-900/60 rounded-xl text-[11px]">
{`def query_metrics(tenant_id: str, filter_val: str):
    # Parameterized query leveraging composite (tenant_id, filter) index
    return db.execute(
        "SELECT * FROM metrics WHERE tenant_id = :t AND filter = :f",
        {"t": tenant_id, "f": filter_val}
    )`}
						</pre>
					</div>
				</div>

				<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
					<strong className="text-cyan-400">AI Rationale:</strong> Replaces string interpolation with parameterized SQL bindings to leverage composite PostgreSQL index and prevent SQL injection risks.
				</div>
			</div>
		</div>
	);
}
