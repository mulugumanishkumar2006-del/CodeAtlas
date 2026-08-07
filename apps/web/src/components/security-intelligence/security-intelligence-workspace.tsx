'use client';

import * as React from 'react';
import { SecurityCommandCenter, SecurityDomainItem } from './security-command-center';
import { SecurityPostureMap } from './security-posture-map';
import { VulnerabilityIntelligencePanel } from './vulnerability-intelligence-panel';
import { AttackPathExplorer } from './attack-path-explorer';
import { DataFlowSecurityPanel } from './data-flow-security-panel';
import { DependencySecretsExplorer } from './dependency-secrets-explorer';
import { SecurityRemediationSimulation } from './security-remediation-simulation';
import { AISecurityAnalystTimeline } from './ai-security-analyst-timeline';
import {
	ShieldCheck,
	ShieldAlert,
	Lock,
	Key,
	Globe,
	UserCheck,
	Database,
	Server,
	Cloud,
	Boxes,
	RefreshCw,
	Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SAMPLE_DOMAINS: SecurityDomainItem[] = [
	{
		id: 'dom-dep',
		name: 'Dependency Risk',
		score: 84,
		findingsCount: 2,
		status: 'HEALTHY',
		trend: 'up',
		trendDelta: 3.0,
		icon: Boxes,
		color: '#6366f1',
		description: 'Minor non-breaking security advisory in stripe v11 package.',
	},
	{
		id: 'dom-sec',
		name: 'Secret Exposure',
		score: 78,
		findingsCount: 2,
		status: 'WARNING',
		trend: 'stable',
		trendDelta: 0.0,
		icon: Key,
		color: '#f59e0b',
		description: 'Stripe test API key committed in test_keys.json file.',
	},
	{
		id: 'dom-api',
		name: 'API Security',
		score: 62,
		findingsCount: 1,
		status: 'CRITICAL',
		trend: 'down',
		trendDelta: -4.5,
		icon: Globe,
		color: '#ef4444',
		description: 'Unsanitized dynamic raw SQL query formatting in analytics API.',
	},
	{
		id: 'dom-auth',
		name: 'Authentication',
		score: 96,
		findingsCount: 0,
		status: 'EXCELLENT',
		trend: 'up',
		trendDelta: 2.0,
		icon: Lock,
		color: '#10b981',
		description: 'JWT verification and zero-trust session management active.',
	},
	{
		id: 'dom-authz',
		name: 'Authorization',
		score: 92,
		findingsCount: 0,
		status: 'HEALTHY',
		trend: 'stable',
		trendDelta: 0.0,
		icon: UserCheck,
		color: '#3b82f6',
		description: 'Fine-grained RBAC permissions enforced across all endpoints.',
	},
	{
		id: 'dom-data',
		name: 'Data Exposure',
		score: 88,
		findingsCount: 1,
		status: 'HEALTHY',
		trend: 'up',
		trendDelta: 1.5,
		icon: Database,
		color: '#8b5cf6',
		description: 'PII and credentials encrypted in transit via TLS 1.3.',
	},
	{
		id: 'dom-infra',
		name: 'Infrastructure Risk',
		score: 90,
		findingsCount: 0,
		status: 'HEALTHY',
		trend: 'stable',
		trendDelta: 0.0,
		icon: Server,
		color: '#14b8a6',
		description: 'Stateless worker threads operating within private subnet.',
	},
	{
		id: 'dom-cloud',
		name: 'Cloud Config Risk',
		score: 94,
		findingsCount: 0,
		status: 'EXCELLENT',
		trend: 'up',
		trendDelta: 4.0,
		icon: Cloud,
		color: '#ec4899',
		description: 'AWS S3 buckets enforced with private KMS encryption policy.',
	},
	{
		id: 'dom-container',
		name: 'Container Risk',
		score: 91,
		findingsCount: 0,
		status: 'HEALTHY',
		trend: 'stable',
		trendDelta: 0.0,
		icon: Boxes,
		color: '#a3e635',
		description: 'Distroless Docker images operating with non-root user.',
	},
	{
		id: 'dom-supply',
		name: 'Supply Chain Risk',
		score: 89,
		findingsCount: 0,
		status: 'HEALTHY',
		trend: 'up',
		trendDelta: 1.0,
		icon: ShieldCheck,
		color: '#06b6d4',
		description: 'npm lockfile integrity signatures verified on all dependencies.',
	},
];

export function SecurityIntelligenceWorkspace() {
	const [activeTab, setActiveTab] = React.useState('command-center');
	const [isScanning, setIsScanning] = React.useState(false);

	const tabs = [
		{ id: 'command-center', label: 'Command Center' },
		{ id: 'map', label: 'Security Posture Map' },
		{ id: 'vulnerabilities', label: 'Vulnerability Intelligence' },
		{ id: 'attack-path', label: 'Attack Path Explorer' },
		{ id: 'data-flow', label: 'Data Flow Security' },
		{ id: 'dependencies', label: 'Dependencies & Secrets' },
		{ id: 'remediation', label: 'Remediation & Simulation' },
		{ id: 'analyst', label: 'AI Analyst & Time Machine' },
	];

	const handleTriggerScan = () => {
		setIsScanning(true);
		setTimeout(() => setIsScanning(false), 1500);
	};

	// Keyboard shortcuts listener
	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.metaKey || e.ctrlKey) {
				const num = parseInt(e.key);
				if (num >= 1 && num <= tabs.length) {
					e.preventDefault();
					setActiveTab(tabs[num - 1].id);
				}
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [tabs]);

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1700px] mx-auto selection:bg-cyan-500/30 selection:text-cyan-200 font-mono">
			{/* Top Workspace Header */}
			<div className="flex flex-col gap-5 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl relative overflow-hidden">
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 z-10">
					<div className="flex items-center gap-3">
						<div className="p-2.5 rounded-2xl bg-gradient-to-tr from-rose-500/20 via-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-950">
							<ShieldCheck className="w-6 h-6 animate-pulse" />
						</div>
						<div>
							<div className="flex items-center gap-2">
								<h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
									Security Intelligence Center
								</h1>
								<span className="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-widest text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 rounded-full uppercase">
									DEFENSIVE AGI
								</span>
							</div>
							<p className="text-xs text-slate-400 font-mono mt-0.5">
								Zero-Trust Architecture Context, AST Vulnerability Tracing, Safe Secret Guard, & Remediation Simulation
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<Button
							onClick={handleTriggerScan}
							disabled={isScanning}
							className={cn(
								'flex items-center gap-2 font-mono text-xs px-4 py-2.5 rounded-xl border shadow-lg transition-all',
								isScanning
									? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
									: 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white border-cyan-400/30'
							)}
						>
							<RefreshCw className={cn('w-4 h-4', isScanning && 'animate-spin')} />
							<span>{isScanning ? 'Scanning Security Surfaces...' : 'Trigger Security Scan'}</span>
						</Button>
					</div>
				</div>

				{/* Tabs Navigation */}
				<div className="flex items-center justify-between border-t border-slate-800/80 pt-4 z-10">
					<div className="flex items-center gap-1 overflow-x-auto scrollbar-none max-w-full">
						{tabs.map((t, idx) => {
							const isActive = activeTab === t.id;
							return (
								<button
									key={t.id}
									onClick={() => setActiveTab(t.id)}
									className={cn(
										'px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap flex items-center gap-2',
										isActive
											? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-950'
											: 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
									)}
								>
									<span>{t.label}</span>
									<span className="text-[9px] text-slate-500 font-mono">⌘{idx + 1}</span>
								</button>
							);
						})}
					</div>
				</div>
			</div>

			{/* Active View Tab Content */}
			{activeTab === 'command-center' && (
				<SecurityCommandCenter
					securityHealthScore={94}
					criticalFindingsCount={1}
					highRiskFindingsCount={2}
					remediationVelocity={18}
					aiConfidenceScore={98}
					domains={SAMPLE_DOMAINS}
					onSelectDomain={() => setActiveTab('map')}
				/>
			)}

			{activeTab === 'map' && <SecurityPostureMap />}

			{activeTab === 'vulnerabilities' && <VulnerabilityIntelligencePanel />}

			{activeTab === 'attack-path' && <AttackPathExplorer />}

			{activeTab === 'data-flow' && <DataFlowSecurityPanel />}

			{activeTab === 'dependencies' && <DependencySecretsExplorer />}

			{activeTab === 'remediation' && <SecurityRemediationSimulation />}

			{activeTab === 'analyst' && <AISecurityAnalystTimeline />}
		</div>
	);
}
