'use client';

import * as React from 'react';
import {
	Boxes,
	Key,
	Lock,
	ShieldAlert,
	Sparkles,
	CheckCircle,
	AlertTriangle,
	ArrowRight,
	ExternalLink,
	Copy,
	Check,
	Eye,
	EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface DependencyRiskItem {
	id: string;
	packageName: string;
	currentVersion: string;
	recommendedVersion: string;
	cveId: string;
	severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
	reachability: 'REACHABLE' | 'UNREACHABLE';
	breakingChangeRisk: 'LOW' | 'MEDIUM' | 'HIGH';
	license: string;
	affectedFiles: string[];
	aiRecommendation: string;
}

export interface DetectedSecretItem {
	id: string;
	secretType: 'Stripe Test API Key' | 'AWS Access Key ID' | 'JWT Private Key' | 'PostgreSQL Password';
	maskedValue: string; // e.g. "sk_test_************************AB12"
	filePath: string;
	lineRange: string;
	gitHistoryExposed: boolean;
	rotationRecommendation: string;
}

const SAMPLE_DEPENDENCIES: DependencyRiskItem[] = [
	{
		id: 'dep-1',
		packageName: 'stripe',
		currentVersion: 'v11.4.0',
		recommendedVersion: 'v12.1.0',
		cveId: 'CVE-2026-8812',
		severity: 'HIGH',
		reachability: 'REACHABLE',
		breakingChangeRisk: 'LOW',
		license: 'MIT',
		affectedFiles: ['apps/backend/app/payment/processor.ts'],
		aiRecommendation: 'Safe minor version upgrade to v12.1.0 available. Zero breaking changes to payment processor methods.',
	},
	{
		id: 'dep-2',
		packageName: 'requests',
		currentVersion: 'v2.28.1',
		recommendedVersion: 'v2.31.0',
		cveId: 'CVE-2026-4410',
		severity: 'MEDIUM',
		reachability: 'REACHABLE',
		breakingChangeRisk: 'LOW',
		license: 'Apache-2.0',
		affectedFiles: ['apps/backend/app/analytics/fetcher.py'],
		aiRecommendation: 'Fixes proxy header leak in requests. Backward compatible patch.',
	},
];

const SAMPLE_SECRETS: DetectedSecretItem[] = [
	{
		id: 'sec-1',
		secretType: 'Stripe Test API Key',
		maskedValue: 'sk_test_************************AB12',
		filePath: 'apps/backend/config/test_keys.json',
		lineRange: 'L12',
		gitHistoryExposed: true,
		rotationRecommendation: 'Revoke key in Stripe Dashboard and migrate secret to AWS Secrets Manager.',
	},
	{
		id: 'sec-2',
		secretType: 'AWS Access Key ID',
		maskedValue: 'AKIA****************',
		filePath: 'k8s/deployment.yaml',
		lineRange: 'L45',
		gitHistoryExposed: false,
		rotationRecommendation: 'Rotate IAM access key and attach AWS IAM Role for Service Accounts (IRSA).',
	},
];

export function DependencySecretsExplorer() {
	const [activeSubTab, setActiveSubTab] = React.useState<'dependencies' | 'secrets'>('dependencies');
	const [unmaskedId, setUnmaskedId] = React.useState<string | null>(null);

	return (
		<div className="space-y-6 font-mono">
			{/* Sub Tabs Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<div className="flex items-center gap-2 text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">
						<Boxes className="w-4 h-4" /> Supply Chain & Credentials Guard
					</div>
					<h2 className="text-xl font-black text-white">Dependency & Secret Security Explorer</h2>
				</div>

				<div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
					<button
						onClick={() => setActiveSubTab('dependencies')}
						className={cn(
							'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2',
							activeSubTab === 'dependencies'
								? 'bg-purple-950/80 border border-purple-500/40 text-purple-300 shadow-lg'
								: 'text-slate-400 hover:text-white'
						)}
					>
						<Boxes className="w-4 h-4" /> Dependency Risks ({SAMPLE_DEPENDENCIES.length})
					</button>

					<button
						onClick={() => setActiveSubTab('secrets')}
						className={cn(
							'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2',
							activeSubTab === 'secrets'
								? 'bg-purple-950/80 border border-purple-500/40 text-purple-300 shadow-lg'
								: 'text-slate-400 hover:text-white'
						)}
					>
						<Key className="w-4 h-4" /> Safe Secret Detection ({SAMPLE_SECRETS.length})
					</button>
				</div>
			</div>

			{/* Dependencies Tab */}
			{activeSubTab === 'dependencies' && (
				<div className="space-y-4">
					{SAMPLE_DEPENDENCIES.map((dep) => (
						<div
							key={dep.id}
							className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4"
						>
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
								<div className="flex items-center gap-3">
									<Boxes className="w-5 h-5 text-purple-400" />
									<div>
										<h3 className="text-base font-black text-white">{dep.packageName}</h3>
										<span className="text-xs text-slate-400">
											Current: <strong className="text-rose-400">{dep.currentVersion}</strong> → Recommended:{' '}
											<strong className="text-emerald-400">{dep.recommendedVersion}</strong>
										</span>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<span className="px-2.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 text-xs font-bold">
										{dep.cveId}
									</span>
									<span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 text-xs font-bold">
										{dep.license}
									</span>
								</div>
							</div>

							{/* Details */}
							<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
								<div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
									<Sparkles className="w-4 h-4" /> AI Non-Breaking Upgrade Recommendation
								</div>
								<p className="text-xs text-slate-300">{dep.aiRecommendation}</p>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Secrets Tab */}
			{activeSubTab === 'secrets' && (
				<div className="space-y-4">
					{SAMPLE_SECRETS.map((sec) => (
						<div
							key={sec.id}
							className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4"
						>
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
								<div className="flex items-center gap-3">
									<Key className="w-5 h-5 text-amber-400" />
									<div>
										<h3 className="text-base font-black text-white">{sec.secretType}</h3>
										<span className="text-xs text-slate-400">{sec.filePath} ({sec.lineRange})</span>
									</div>
								</div>

								{sec.gitHistoryExposed && (
									<span className="px-2.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 text-xs font-bold">
										⚠️ EXPOSED IN GIT HISTORY
									</span>
								)}
							</div>

							{/* Masked Secret Box */}
							<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs">
								<div className="flex items-center gap-3">
									<Lock className="w-4 h-4 text-amber-400" />
									<span className="text-amber-300 font-bold tracking-widest">{sec.maskedValue}</span>
								</div>
								<span className="text-[10px] text-slate-500 uppercase font-bold">Safely Masked</span>
							</div>

							<div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1">
								<div className="text-xs font-bold text-amber-400">Rotation & Remediation Action:</div>
								<p className="text-xs text-slate-300">{sec.rotationRecommendation}</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
