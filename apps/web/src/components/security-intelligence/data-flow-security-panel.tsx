'use client';

import * as React from 'react';
import {
	Database,
	Key,
	Lock,
	ArrowRight,
	Sparkles,
	ShieldCheck,
	CheckCircle,
	AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SensitiveDataTrace {
	id: string;
	dataType: 'Credentials' | 'Tokens' | 'Personal Data (PII)' | 'Financial Data' | 'API Keys';
	source: string;
	transformation: string;
	storage: string;
	transmission: string;
	consumers: string[];
	externalBoundary: string;
	riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
	aiDataFlowReasoning: string;
}

const SAMPLE_DATA_FLOWS: SensitiveDataTrace[] = [
	{
		id: 'df-1',
		dataType: 'Credentials',
		source: 'User Auth Login Form (/api/v1/auth/login)',
		transformation: 'Bcrypt Hash (Work factor 12) in Auth Vault',
		storage: 'PostgreSQL auth_credentials table',
		transmission: 'TLS 1.3 Encrypted HTTPS Connection',
		consumers: ['auth-vault-service', 'user-profile-service'],
		externalBoundary: 'Zero-Trust Internal VPC',
		riskLevel: 'LOW',
		aiDataFlowReasoning: 'Credentials are encrypted in transit via TLS 1.3 and hashed with bcrypt before persistence.',
	},
	{
		id: 'df-2',
		dataType: 'Financial Data',
		source: 'Checkout Gateway API (/api/v1/checkout)',
		transformation: 'Stripe Tokenization (No raw card data stored)',
		storage: 'Stripe PCI-DSS Vault (External)',
		transmission: 'mTLS HTTPS Webhook Callback',
		consumers: ['payment-processor-service', 'billing-notifier'],
		externalBoundary: 'Stripe External API Boundary',
		riskLevel: 'LOW',
		aiDataFlowReasoning: 'Raw credit card numbers never touch repository databases; tokenized references handled cleanly.',
	},
	{
		id: 'df-3',
		dataType: 'API Keys',
		source: 'Config Environment Secrets (.env.production)',
		transformation: 'Plaintext string injection in analytics_raw.py',
		storage: 'Process Environment Memory',
		transmission: 'Internal DB Socket Connection',
		consumers: ['analytics-db-service'],
		externalBoundary: 'Internal Network Socket',
		riskLevel: 'HIGH',
		aiDataFlowReasoning: 'Unsanitized raw SQL formatted query could expose internal API keys if tenant parameters are manipulated.',
	},
];

export function DataFlowSecurityPanel() {
	const [selectedFlowId, setSelectedFlowId] = React.useState<string>('df-[1,2,3]'[0]);
	const [activeFlowId, setActiveFlowId] = React.useState<string>('df-3');

	const activeFlow = SAMPLE_DATA_FLOWS.find((f) => f.id === activeFlowId) || SAMPLE_DATA_FLOWS[2];

	return (
		<div className="space-y-6 font-mono">
			{/* Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div>
					<div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
						<Database className="w-4 h-4" /> Knowledge Graph Data Lineage
					</div>
					<h2 className="text-xl font-black text-white">Sensitive Data Flow Security Tracer</h2>
					<p className="text-xs text-slate-400">
						Traces credentials, tokens, PII, financial data, and API keys across source, storage, transmission, and external boundaries.
					</p>
				</div>
			</div>

			{/* Data Flow Selector Tabs */}
			<div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
				{SAMPLE_DATA_FLOWS.map((flow) => (
					<button
						key={flow.id}
						onClick={() => setActiveFlowId(flow.id)}
						className={cn(
							'px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all border whitespace-nowrap',
							flow.id === activeFlow.id
								? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 shadow-lg shadow-cyan-950'
								: 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
						)}
					>
						🔑 {flow.dataType}
					</button>
				))}
			</div>

			{/* Active Data Flow Lineage Card */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 font-mono">
				<div className="flex items-center justify-between border-b border-slate-800 pb-3">
					<h3 className="text-base font-black text-white">Lineage Trace: {activeFlow.dataType}</h3>
					<span
						className={cn(
							'px-2.5 py-1 rounded text-xs font-bold uppercase',
							activeFlow.riskLevel === 'HIGH' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
						)}
					>
						{activeFlow.riskLevel} RISK LINEAGE
					</span>
				</div>

				{/* 4 Lineage Steps */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
						<span className="text-[10px] text-cyan-400 font-bold uppercase">1. Source</span>
						<div className="font-bold text-white">{activeFlow.source}</div>
					</div>

					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
						<span className="text-[10px] text-purple-400 font-bold uppercase">2. Transformation</span>
						<div className="font-bold text-white">{activeFlow.transformation}</div>
					</div>

					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
						<span className="text-[10px] text-emerald-400 font-bold uppercase">3. Storage</span>
						<div className="font-bold text-white">{activeFlow.storage}</div>
					</div>

					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
						<span className="text-[10px] text-amber-400 font-bold uppercase">4. External Boundary</span>
						<div className="font-bold text-white">{activeFlow.externalBoundary}</div>
					</div>
				</div>

				{/* AI Data Flow Reasoning */}
				<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
					<div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
						<Sparkles className="w-4 h-4" /> AI Knowledge Graph Lineage Reasoning
					</div>
					<p className="text-xs text-slate-300 leading-relaxed">
						{activeFlow.aiDataFlowReasoning}
					</p>
				</div>
			</div>
		</div>
	);
}
