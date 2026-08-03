'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
	ShieldAlert,
	ShieldCheck,
	HeartPulse,
	Activity,
	Orbit,
	BarChart3,
	Award,
	ExternalLink,
	Zap,
	Clock,
	CheckCircle2,
	TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MonitorWorkflowPage() {
	const [activeTab, setActiveTab] = useState<'mission' | 'security' | 'health' | 'dora'>('mission');

	return (
		<div className="space-y-8 max-w-7xl mx-auto pb-12">
			{/* Top Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-5">
				<div>
					<div className="flex items-center gap-3">
						<h1 className="text-2xl font-black tracking-tight text-white">Monitor & SRE Mission Control</h1>
						<span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider">
							SRE & COMPLIANCE HUD
						</span>
					</div>
					<p className="text-xs text-slate-400 mt-1">
						Continuous security posture monitoring, SOC2/ISO27001 regulatory mapping, SRE uptime scorecards, and DORA benchmarks.
					</p>
				</div>
			</div>

			{/* Sub-Workflow Navigation Tabs */}
			<div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 overflow-x-auto">
				<button
					onClick={() => setActiveTab('mission')}
					className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
						activeTab === 'mission'
							? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30 shadow-md font-bold'
							: 'text-slate-400 hover:bg-slate-900'
					}`}
				>
					<Orbit className="h-4 w-4 text-indigo-400" /> Mission Control Operational HUD
				</button>
				<button
					onClick={() => setActiveTab('security')}
					className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
						activeTab === 'security'
							? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30 shadow-md font-bold'
							: 'text-slate-400 hover:bg-slate-900'
					}`}
				>
					<ShieldCheck className="h-4 w-4 text-emerald-400" /> Security & Posture Audit
				</button>
				<button
					onClick={() => setActiveTab('health')}
					className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
						activeTab === 'health'
							? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30 shadow-md font-bold'
							: 'text-slate-400 hover:bg-slate-900'
					}`}
				>
					<HeartPulse className="h-4 w-4 text-rose-400" /> System Uptime & SLA Scorecard
				</button>
				<button
					onClick={() => setActiveTab('dora')}
					className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
						activeTab === 'dora'
							? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30 shadow-md font-bold'
							: 'text-slate-400 hover:bg-slate-900'
					}`}
				>
					<Award className="h-4 w-4 text-amber-400" /> DORA Engineering Benchmarks
				</button>
			</div>

			{/* Operational HUD Metrics Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="glass-card rounded-2xl p-5 space-y-2">
					<span className="text-[10px] font-bold text-slate-400 uppercase font-mono">System Availability</span>
					<h3 className="text-2xl font-black text-emerald-400">99.99% Uptime</h3>
					<p className="text-xs text-slate-400 font-mono">Target SLA: 99.95% (Exceeded)</p>
				</div>
				<div className="glass-card rounded-2xl p-5 space-y-2">
					<span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Deployment Frequency</span>
					<h3 className="text-2xl font-black text-cyan-400">12.4 / day</h3>
					<p className="text-xs text-slate-400 font-mono">DORA Tier: Elite Performer</p>
				</div>
				<div className="glass-card rounded-2xl p-5 space-y-2">
					<span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Lead Time for Changes</span>
					<h3 className="text-2xl font-black text-indigo-400">38 mins</h3>
					<p className="text-xs text-slate-400 font-mono">Sub-hour commit to prod</p>
				</div>
				<div className="glass-card rounded-2xl p-5 space-y-2">
					<span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Change Failure Rate</span>
					<h3 className="text-2xl font-black text-emerald-400">0.8%</h3>
					<p className="text-xs text-slate-400 font-mono">Automated rollback enabled</p>
				</div>
			</div>

			{/* Mission Control Live Studio Card */}
			{activeTab === 'mission' && (
				<div className="glass-card rounded-2xl p-6 border border-slate-800/80 space-y-4">
					<div className="flex justify-between items-center border-b border-slate-800/80 pb-4">
						<div>
							<h3 className="text-base font-black text-white">Mission Control Operational Studio</h3>
							<p className="text-xs text-slate-400">
								Real-time telemetry HUD tracking active repository indexers, security compliance, and AST background workers.
							</p>
						</div>
						<Link href="/mission-control">
							<Button className="text-xs font-bold gap-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white">
								Launch Fullscreen Studio <ExternalLink className="w-3.5 h-3.5" />
							</Button>
						</Link>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
						<div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
							<div className="flex justify-between text-xs font-mono">
								<span className="text-slate-400">AST Indexer Worker #1</span>
								<span className="text-emerald-400 font-bold">RUNNING</span>
							</div>
							<div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
								<div className="bg-cyan-400 h-full w-[78%]" />
							</div>
							<p className="text-[10px] text-slate-500 font-mono">Processing: PaymentService.py</p>
						</div>
						<div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
							<div className="flex justify-between text-xs font-mono">
								<span className="text-slate-400">Celery Task Queue</span>
								<span className="text-emerald-400 font-bold">IDLE (0 QUEUED)</span>
							</div>
							<div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
								<div className="bg-emerald-400 h-full w-[100%]" />
							</div>
							<p className="text-[10px] text-slate-500 font-mono font-bold text-emerald-400">Redis Broker Healthy</p>
						</div>
						<div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
							<div className="flex justify-between text-xs font-mono">
								<span className="text-slate-400">SOC2 Audit Daemon</span>
								<span className="text-emerald-400 font-bold">PASSED (96%)</span>
							</div>
							<div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
								<div className="bg-indigo-400 h-full w-[96%]" />
							</div>
							<p className="text-[10px] text-slate-500 font-mono">Zero compliance violations</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
