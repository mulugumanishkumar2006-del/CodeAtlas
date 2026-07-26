'use client';

import React, { useState } from 'react';
import {
                        TrendingUp,
                        Users,
                        Award,
                        DollarSign,
                        Zap,
                        ShieldCheck,
                        Activity,
                        Rocket,
                        BrainCircuit,
                        Building2,
                        CheckCircle2,
                        AlertTriangle,
                        ArrowUpRight,
                        ArrowDownRight,
                        Sparkles,
                        Search,
                        Sliders,
                        Layers,
                        FileCode,
                        Shield,
                        Gauge,
                        Clock,
                        RefreshCw,
} from 'lucide-react';

export default function MaturityBenchmarkingPage() {
                        const [activeTab, setActiveTab] = useState<string>('maturity');
                        const [selectedIndustry, setSelectedIndustry] = useState<string>('FinTech');
                        const [repoA, setRepoA] = useState<string>('main-production');
                        const [repoB, setRepoB] = useState<string>('feature-refactor-v2');
                        const [aiPrompt, setAiPrompt] = useState<string>(
                                                'Migrate auth service REST endpoint to gRPC streaming vault protocol'
                        );

                        // Feature 21 Data
                        const evolutionDeltas = [
                                                {
                                                                        metric: 'Codebase Size (LOC)',
                                                                        base: '45,200',
                                                                        target: '58,400',
                                                                        delta: '+29.2%',
                                                                        status: 'improved',
                                                },
                                                {
                                                                        metric: 'Cyclomatic Complexity Avg',
                                                                        base: '6.4',
                                                                        target: '4.8',
                                                                        delta: '-25.0%',
                                                                        status: 'improved',
                                                },
                                                {
                                                                        metric: 'Test Coverage %',
                                                                        base: '72.5%',
                                                                        target: '88.4%',
                                                                        delta: '+15.9%',
                                                                        status: 'improved',
                                                },
                                                {
                                                                        metric: 'Code Duplication %',
                                                                        base: '12.1%',
                                                                        target: '4.3%',
                                                                        delta: '-64.4%',
                                                                        status: 'improved',
                                                },
                                                {
                                                                        metric: 'Commit Velocity (commits/wk)',
                                                                        base: '14.0',
                                                                        target: '28.5',
                                                                        delta: '+103.5%',
                                                                        status: 'improved',
                                                },
                        ];

                        // Feature 22 Data
                        const workflowData = {
                                                prLeadTime: '14.2 hrs',
                                                reviewTurnaround: '4.5 hrs',
                                                deployFrequency: '18.5 / wk',
                                                burnoutRisk: 'Low',
                                                productivityPercentile: '89.4th Percentile',
                                                bottlenecks: [
                                                                        {
                                                                                                stage: 'Pull Request Review',
                                                                                                time: '6.5 hrs',
                                                                                                severity: 'medium',
                                                                                                rec: 'Auto-assign PRs via CODEOWNERS routing.',
                                                                        },
                                                                        {
                                                                                                stage: 'Integration Tests',
                                                                                                time: '2.8 hrs',
                                                                                                severity: 'low',
                                                                                                rec: 'Enable pytest-xdist parallel test execution.',
                                                                        },
                                                ],
                        };

                        // Feature 23 Data
                        const maturityPillars = [
                                                {
                                                                        name: 'Architecture & Design',
                                                                        score: 92.0,
                                                                        level: 'L4 Measured',
                                                                        color: 'from-blue-500 to-indigo-500',
                                                },
                                                {
                                                                        name: 'Test Automation & Quality',
                                                                        score: 88.5,
                                                                        level: 'L4 Measured',
                                                                        color: 'from-cyan-500 to-blue-500',
                                                },
                                                {
                                                                        name: 'Security & Governance',
                                                                        score: 95.0,
                                                                        level: 'L5 Optimized',
                                                                        color: 'from-emerald-500 to-teal-500',
                                                },
                                                {
                                                                        name: 'CI/CD & Release Readiness',
                                                                        score: 91.0,
                                                                        level: 'L4 Measured',
                                                                        color: 'from-purple-500 to-indigo-500',
                                                },
                                                {
                                                                        name: 'Code Quality & Docs',
                                                                        score: 86.0,
                                                                        level: 'L4 Measured',
                                                                        color: 'from-amber-500 to-orange-500',
                                                },
                                                {
                                                                        name: 'Operational Readiness SRE',
                                                                        score: 90.0,
                                                                        level: 'L4 Measured',
                                                                        color: 'from-rose-500 to-pink-500',
                                                },
                        ];

                        // Feature 24 Data
                        const techDebt = {
                                                totalHours: '36.5 hrs',
                                                remediationCost: '$4,197.50 USD',
                                                density: '0.81 hrs / KLOC',
                                                duplicationPct: '3.8%',
                                                percentile: 'Top 7% globally',
                                                categories: [
                                                                        {
                                                                                                name: 'Architectural Coupling & Circular Imports',
                                                                                                hours: 18.5,
                                                                                                count: 4,
                                                                                                percentile: '88th',
                                                                        },
                                                                        {
                                                                                                name: 'Cognitive Complexity & Deep Nesting',
                                                                                                hours: 12.0,
                                                                                                count: 6,
                                                                                                percentile: '92nd',
                                                                        },
                                                                        {
                                                                                                name: 'Code Duplication & Magic Literals',
                                                                                                hours: 6.5,
                                                                                                count: 3,
                                                                                                percentile: '95th',
                                                                        },
                                                ],
                        };

                        // Feature 25 Data
                        const scalability = {
                                                readinessScore: 94.5,
                                                maxRps: '45,000 req/sec',
                                                horizontalStatus: 'Optimal (Stateless)',
                                                memoryRisk: '1.2 / 10 (Very Low)',
                                                bottlenecks: [
                                                                        {
                                                                                                component: 'PgBouncer DB Pool',
                                                                                                max: '1,000 conns',
                                                                                                risk: 'Moderate',
                                                                                                fix: 'Add transaction pooling caps.',
                                                                        },
                                                                        {
                                                                                                component: 'External Webhook Dispatch',
                                                                                                max: '1,200 req/s',
                                                                                                risk: 'Low',
                                                                                                fix: 'Migrate to Celery queue.',
                                                                        },
                                                ],
                        };

                        // Feature 26 Data
                        const reliability = {
                                                index: '96.8 / 100',
                                                mtbf: '720.0 hrs',
                                                circuitBreakerCoverage: '92.4%',
                                                errorBoundaryCoverage: '95.0%',
                                                rating: 'A+ (High Availability)',
                                                slaTier: '99.99% Availability SLA',
                        };

                        // Feature 27 Data
                        const observability = {
                                                score: '93.2 / 100',
                                                tracingCoverage: '94.0%',
                                                structuredLogging: '98.5%',
                                                metricInstrumentation: '91.0%',
                                                signalToNoise: '0.88 (High Quality)',
                                                tier: 'Full Distributed Observability',
                        };

                        // Feature 28 Data
                        const releaseMaturity = {
                                                score: '95.0 / 100',
                                                doraTier: 'Elite',
                                                featureFlagsPct: '88.0%',
                                                canaryReady: true,
                                                autoRollbackReady: true,
                                                mttrMinutes: '4.2 min',
                                                changeFailureRate: '1.1%',
                        };

                        // Feature 29 Data
                        const aiConfidence = {
                                                scorePct: 94.8,
                                                tier: 'High Confidence',
                                                evidence: [
                                                                        {
                                                                                                source: 'AST Static Analysis',
                                                                                                weight: '35%',
                                                                                                finding: '0 interface breaking changes across 14 modules.',
                                                                        },
                                                                        {
                                                                                                source: 'Historical Regression Benchmark',
                                                                                                weight: '35%',
                                                                                                finding: '99.4% historical success rate in similar repos.',
                                                                        },
                                                                        {
                                                                                                source: 'OWASP Security Verification',
                                                                                                weight: '30%',
                                                                                                finding: 'Complies with RS256 cryptographic key isolation.',
                                                                        },
                                                ],
                                                riskIndices: [
                                                                        {
                                                                                                name: 'API Breaking Change Risk',
                                                                                                risk: '2.0%',
                                                                        },
                                                                        {
                                                                                                name: 'Performance Degradation Risk',
                                                                                                risk: '1.0%',
                                                                        },
                                                                        {
                                                                                                name: 'Security Vulnerability Risk',
                                                                                                risk: '0.0%',
                                                                        },
                                                ],
                        };

                        // Feature 30 Data
                        const industryProfiles: Record<string, any> = {
                                                FinTech: {
                                                                        alignScore: 96.0,
                                                                        standards: [
                                                                                                {
                                                                                                                        name: 'PCI-DSS v4.0',
                                                                                                                        status: 'Compliant',
                                                                                                                        pct: '98.5%',
                                                                                                },
                                                                                                {
                                                                                                                        name: 'SOC 2 Type II',
                                                                                                                        status: 'Compliant',
                                                                                                                        pct: '96.0%',
                                                                                                },
                                                                                                {
                                                                                                                        name: 'ISO 27001',
                                                                                                                        status: 'Compliant',
                                                                                                                        pct: '94.0%',
                                                                                                },
                                                                        ],
                                                                        recommendations: [
                                                                                                'Enforce hardware security module (HSM) or AWS KMS key rotation.',
                                                                                                'Implement double-entry cryptographic audit logging for financial transactions.',
                                                                                                'Maintain sub-millisecond database transaction lock timeout.',
                                                                        ],
                                                                        patterns: [
                                                                                                'Transactional Outbox',
                                                                                                'Event Sourcing',
                                                                                                'Token Vault Isolation',
                                                                        ],
                                                },
                                                HealthTech: {
                                                                        alignScore: 94.0,
                                                                        standards: [
                                                                                                {
                                                                                                                        name: 'HIPAA Security Rule',
                                                                                                                        status: 'Compliant',
                                                                                                                        pct: '97.0%',
                                                                                                },
                                                                                                {
                                                                                                                        name: 'HITECH Act',
                                                                                                                        status: 'Compliant',
                                                                                                                        pct: '95.0%',
                                                                                                },
                                                                                                {
                                                                                                                        name: 'GDPR Health Data Art. 9',
                                                                                                                        status: 'Compliant',
                                                                                                                        pct: '96.5%',
                                                                                                },
                                                                        ],
                                                                        recommendations: [
                                                                                                'Encrypt all PHI (Protected Health Information) fields at rest with AES-256-GCM.',
                                                                                                'Implement role-based patient access controls with strict audit trail telemetry.',
                                                                                                'Enforce automatic field-level redaction in logging middleware.',
                                                                        ],
                                                                        patterns: [
                                                                                                'Field-Level Encryption',
                                                                                                'Zero-Trust Data Vault',
                                                                                                'Anonymized Analytics',
                                                                        ],
                                                },
                                                CyberSecurity: {
                                                                        alignScore: 97.5,
                                                                        standards: [
                                                                                                {
                                                                                                                        name: 'NIST SP 800-53',
                                                                                                                        status: 'Compliant',
                                                                                                                        pct: '99.0%',
                                                                                                },
                                                                                                {
                                                                                                                        name: 'CISA Zero Trust Model',
                                                                                                                        status: 'Compliant',
                                                                                                                        pct: '96.5%',
                                                                                                },
                                                                                                {
                                                                                                                        name: 'SOC 2 Type II',
                                                                                                                        status: 'Compliant',
                                                                                                                        pct: '98.0%',
                                                                                                },
                                                                        ],
                                                                        recommendations: [
                                                                                                'Enforce mutual TLS (mTLS) for all inter-service gRPC communications.',
                                                                                                'Automate key rotation for JWT tokens every 24 hours with RS256 algorithm.',
                                                                                                'Integrate real-time behavioral anomaly detection in gateway middleware.',
                                                                        ],
                                                                        patterns: [
                                                                                                'Zero Trust Architecture',
                                                                                                'mTLS Service Mesh',
                                                                                                'RASP Runtime Self-Protection',
                                                                        ],
                                                },
                                                'Cloud-Native SaaS': {
                                                                        alignScore: 95.0,
                                                                        standards: [
                                                                                                {
                                                                                                                        name: 'SOC 2 Type II',
                                                                                                                        status: 'Compliant',
                                                                                                                        pct: '97.0%',
                                                                                                },
                                                                                                {
                                                                                                                        name: 'GDPR Privacy',
                                                                                                                        status: 'Compliant',
                                                                                                                        pct: '96.0%',
                                                                                                },
                                                                                                {
                                                                                                                        name: 'ISO 27001',
                                                                                                                        status: 'Compliant',
                                                                                                                        pct: '95.0%',
                                                                                                },
                                                                        ],
                                                                        recommendations: [
                                                                                                'Implement multi-region active-active deployment for high availability.',
                                                                                                'Enforce strict OpenAPI 3.1 schema validation for all public endpoints.',
                                                                                                'Automate dependency vulnerability scanning with Dependabot / Snyk in CI/CD.',
                                                                        ],
                                                                        patterns: [
                                                                                                'BFF Gateway',
                                                                                                'CQRS Event Sourcing',
                                                                                                'Circuit Breaker Pattern',
                                                                        ],
                                                },
                        };

                        const currentIndustryData =
                                                industryProfiles[selectedIndustry] ||
                                                industryProfiles['Cloud-Native SaaS'];

                        return (
                                                <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
                                                                        {/* Top Banner Header */}
                                                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
                                                                                                <div>
                                                                                                                        <div className="flex items-center gap-3 mb-2">
                                                                                                                                                <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
                                                                                                                                                                        <Award className="w-8 h-8" />
                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                                        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
                                                                                                                                                                                                Features
                                                                                                                                                                                                21–30
                                                                                                                                                                                                —
                                                                                                                                                                                                CodeAtlas
                                                                                                                                                                                                Core
                                                                                                                                                                                                Suite
                                                                                                                                                                        </span>
                                                                                                                                                                        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Maturity
                                                                                                                                                                                                &
                                                                                                                                                                                                Benchmarking
                                                                                                                                                                                                Suite
                                                                                                                                                                        </h1>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                        <p className="text-slate-400 text-sm max-w-3xl">
                                                                                                                                                Empowers
                                                                                                                                                software
                                                                                                                                                organizations
                                                                                                                                                with
                                                                                                                                                deep
                                                                                                                                                comparative
                                                                                                                                                evolution
                                                                                                                                                intelligence,
                                                                                                                                                5-tier
                                                                                                                                                engineering
                                                                                                                                                maturity
                                                                                                                                                scoring,
                                                                                                                                                multi-dimensional
                                                                                                                                                reliability/scalability
                                                                                                                                                benchmarks,
                                                                                                                                                explainable
                                                                                                                                                AI
                                                                                                                                                confidence,
                                                                                                                                                and
                                                                                                                                                industry
                                                                                                                                                compliance
                                                                                                                                                standards.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-xs">
                                                                                                                        <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                                                                                                                        <div>
                                                                                                                                                <div className="text-slate-400">
                                                                                                                                                                        Overall
                                                                                                                                                                        Maturity
                                                                                                                                                                        Level
                                                                                                                                                </div>
                                                                                                                                                <div className="text-sm font-bold text-indigo-300">
                                                                                                                                                                        Level
                                                                                                                                                                        4
                                                                                                                                                                        —
                                                                                                                                                                        Measured
                                                                                                                                                                        (91.2th
                                                                                                                                                                        Percentile)
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Tabs Bar */}
                                                                        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-thin">
                                                                                                {[
                                                                                                                        {
                                                                                                                                                id: 'maturity',
                                                                                                                                                label: 'Engineering Maturity',
                                                                                                                                                icon: Award,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'evolution',
                                                                                                                                                label: 'Evolution Comparison',
                                                                                                                                                icon: TrendingUp,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'workflow',
                                                                                                                                                label: 'Team Workflow Intel',
                                                                                                                                                icon: Users,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'debt',
                                                                                                                                                label: 'Tech Debt Benchmark',
                                                                                                                                                icon: DollarSign,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'scalability',
                                                                                                                                                label: 'Scalability Benchmark',
                                                                                                                                                icon: Zap,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'reliability',
                                                                                                                                                label: 'Reliability Benchmark',
                                                                                                                                                icon: ShieldCheck,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'observability',
                                                                                                                                                label: 'Observability Benchmark',
                                                                                                                                                icon: Activity,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'release',
                                                                                                                                                label: 'Release Maturity',
                                                                                                                                                icon: Rocket,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'ai_confidence',
                                                                                                                                                label: 'AI Confidence Engine',
                                                                                                                                                icon: BrainCircuit,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'industry',
                                                                                                                                                label: 'Industry Standards',
                                                                                                                                                icon: Building2,
                                                                                                                        },
                                                                                                ].map(
                                                                                                                        (
                                                                                                                                                tab
                                                                                                                        ) => {
                                                                                                                                                const Icon =
                                                                                                                                                                        tab.icon;
                                                                                                                                                const isActive =
                                                                                                                                                                        activeTab ===
                                                                                                                                                                        tab.id;
                                                                                                                                                return (
                                                                                                                                                                        <button
                                                                                                                                                                                                key={
                                                                                                                                                                                                                        tab.id
                                                                                                                                                                                                }
                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                        setActiveTab(
                                                                                                                                                                                                                                                tab.id
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                                                                                                                                                                                                                        isActive
                                                                                                                                                                                                                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                                                                                                                                                                                                                                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/80'
                                                                                                                                                                                                }`}
                                                                                                                                                                        >
                                                                                                                                                                                                <Icon className="w-4 h-4" />
                                                                                                                                                                                                {
                                                                                                                                                                                                                        tab.label
                                                                                                                                                                                                }
                                                                                                                                                                        </button>
                                                                                                                                                );
                                                                                                                        }
                                                                                                )}
                                                                        </div>

                                                                        {/* TAB 1: Engineering Maturity Model (Feature 23) */}
                                                                        {activeTab ===
                                                                                                'maturity' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
                                                                                                                                                                                                Overall
                                                                                                                                                                                                Maturity
                                                                                                                                                                                                Score
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-4xl font-black text-white">
                                                                                                                                                                                                90.4{' '}
                                                                                                                                                                                                <span className="text-xl font-normal text-slate-400">
                                                                                                                                                                                                                        /
                                                                                                                                                                                                                        100
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                                                                                                                                                                                                <CheckCircle2 className="w-4 h-4" />{' '}
                                                                                                                                                                                                Level
                                                                                                                                                                                                4
                                                                                                                                                                                                —
                                                                                                                                                                                                Measured
                                                                                                                                                                                                Tier
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="mt-4 w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                                                                                                                                                                                <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full w-[90.4%]" />
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
                                                                                                                                                                                                Global
                                                                                                                                                                                                Industry
                                                                                                                                                                                                Percentile
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-4xl font-black text-cyan-400">
                                                                                                                                                                                                91.2th
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="mt-3 text-xs text-slate-400">
                                                                                                                                                                                                Outperforms
                                                                                                                                                                                                91.2%
                                                                                                                                                                                                of
                                                                                                                                                                                                sampled
                                                                                                                                                                                                enterprise
                                                                                                                                                                                                software
                                                                                                                                                                                                repositories
                                                                                                                                                                                                globally.
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
                                                                                                                                                                                                Roadmap
                                                                                                                                                                                                to
                                                                                                                                                                                                Level
                                                                                                                                                                                                5
                                                                                                                                                                                                (Optimized)
                                                                                                                                                                        </div>
                                                                                                                                                                        <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
                                                                                                                                                                                                <li className="flex items-center gap-2">
                                                                                                                                                                                                                        <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400" />{' '}
                                                                                                                                                                                                                        Automate
                                                                                                                                                                                                                        ADR
                                                                                                                                                                                                                        decision
                                                                                                                                                                                                                        verification
                                                                                                                                                                                                                        in
                                                                                                                                                                                                                        CI
                                                                                                                                                                                                </li>
                                                                                                                                                                                                <li className="flex items-center gap-2">
                                                                                                                                                                                                                        <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400" />{' '}
                                                                                                                                                                                                                        Integrate
                                                                                                                                                                                                                        Chaos
                                                                                                                                                                                                                        Mesh
                                                                                                                                                                                                                        resilience
                                                                                                                                                                                                                        drills
                                                                                                                                                                                                </li>
                                                                                                                                                                                                <li className="flex items-center gap-2">
                                                                                                                                                                                                                        <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400" />{' '}
                                                                                                                                                                                                                        Automate
                                                                                                                                                                                                                        stale
                                                                                                                                                                                                                        feature-flag
                                                                                                                                                                                                                        deprecation
                                                                                                                                                                                                </li>
                                                                                                                                                                        </ul>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        {/* 6 Pillars Grid */}
                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                                                                                                {maturityPillars.map(
                                                                                                                                                                        (
                                                                                                                                                                                                pillar,
                                                                                                                                                                                                idx
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <div className="flex items-center justify-between mb-4">
                                                                                                                                                                                                                                                <span className="text-sm font-bold text-white">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                pillar.name
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                pillar.level
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="flex items-baseline gap-2 mb-2">
                                                                                                                                                                                                                                                <span className="text-3xl font-extrabold text-white">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                pillar.score
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-xs text-slate-400">
                                                                                                                                                                                                                                                                        /
                                                                                                                                                                                                                                                                        100
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-4">
                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                        className={`bg-gradient-to-r ${pillar.color} h-full`}
                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                width: `${pillar.score}%`,
                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="text-xs text-slate-400">
                                                                                                                                                                                                                                                <span className="font-semibold text-slate-300">
                                                                                                                                                                                                                                                                        Key
                                                                                                                                                                                                                                                                        Strengths:
                                                                                                                                                                                                                                                </span>{' '}
                                                                                                                                                                                                                                                Strict
                                                                                                                                                                                                                                                typing,
                                                                                                                                                                                                                                                clean
                                                                                                                                                                                                                                                modular
                                                                                                                                                                                                                                                boundaries,
                                                                                                                                                                                                                                                and
                                                                                                                                                                                                                                                automated
                                                                                                                                                                                                                                                linting.
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 2: Repository Evolution Comparison (Feature 21) */}
                                                                        {activeTab ===
                                                                                                'evolution' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                                                                                                                                        <TrendingUp className="w-5 h-5 text-indigo-400" />{' '}
                                                                                                                                                                        Repository
                                                                                                                                                                        Snapshot
                                                                                                                                                                        &
                                                                                                                                                                        Evolution
                                                                                                                                                                        Comparison
                                                                                                                                                </h2>
                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <label className="text-xs text-slate-400 block mb-1 font-semibold">
                                                                                                                                                                                                                        Baseline
                                                                                                                                                                                                                        Branch
                                                                                                                                                                                                                        /
                                                                                                                                                                                                                        Repo
                                                                                                                                                                                                </label>
                                                                                                                                                                                                <input
                                                                                                                                                                                                                        type="text"
                                                                                                                                                                                                                        value={
                                                                                                                                                                                                                                                repoA
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        onChange={(
                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                        ) =>
                                                                                                                                                                                                                                                setRepoA(
                                                                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                                                                .target
                                                                                                                                                                                                                                                                                                .value
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                                                                                                                                                                                                />
                                                                                                                                                                        </div>
                                                                                                                                                                        <div>
                                                                                                                                                                                                <label className="text-xs text-slate-400 block mb-1 font-semibold">
                                                                                                                                                                                                                        Target
                                                                                                                                                                                                                        Branch
                                                                                                                                                                                                                        /
                                                                                                                                                                                                                        Repo
                                                                                                                                                                                                </label>
                                                                                                                                                                                                <input
                                                                                                                                                                                                                        type="text"
                                                                                                                                                                                                                        value={
                                                                                                                                                                                                                                                repoB
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        onChange={(
                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                        ) =>
                                                                                                                                                                                                                                                setRepoB(
                                                                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                                                                .target
                                                                                                                                                                                                                                                                                                .value
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                                                                                                                                                                                                />
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                <div className="overflow-x-auto">
                                                                                                                                                                        <table className="w-full text-left text-xs border-collapse">
                                                                                                                                                                                                <thead>
                                                                                                                                                                                                                        <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                                                                                                                                                                                                                                                <th className="pb-3">
                                                                                                                                                                                                                                                                        Metric
                                                                                                                                                                                                                                                                        Name
                                                                                                                                                                                                                                                </th>
                                                                                                                                                                                                                                                <th className="pb-3">
                                                                                                                                                                                                                                                                        Baseline
                                                                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                repoA
                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                </th>
                                                                                                                                                                                                                                                <th className="pb-3">
                                                                                                                                                                                                                                                                        Target
                                                                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                repoB
                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                </th>
                                                                                                                                                                                                                                                <th className="pb-3">
                                                                                                                                                                                                                                                                        Change
                                                                                                                                                                                                                                                                        Delta
                                                                                                                                                                                                                                                </th>
                                                                                                                                                                                                                                                <th className="pb-3">
                                                                                                                                                                                                                                                                        Verdict
                                                                                                                                                                                                                                                                        Status
                                                                                                                                                                                                                                                </th>
                                                                                                                                                                                                                        </tr>
                                                                                                                                                                                                </thead>
                                                                                                                                                                                                <tbody className="divide-y divide-slate-800/60">
                                                                                                                                                                                                                        {evolutionDeltas.map(
                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                        row,
                                                                                                                                                                                                                                                                        i
                                                                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                                                                        <tr
                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                        i
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                className="hover:bg-slate-800/30"
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                <td className="py-3 font-medium text-slate-200">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                row.metric
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </td>
                                                                                                                                                                                                                                                                                                <td className="py-3 text-slate-400">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                row.base
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </td>
                                                                                                                                                                                                                                                                                                <td className="py-3 font-bold text-white">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                row.target
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </td>
                                                                                                                                                                                                                                                                                                <td className="py-3 font-bold text-emerald-400 flex items-center gap-1">
                                                                                                                                                                                                                                                                                                                        <ArrowUpRight className="w-3.5 h-3.5" />{' '}
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                row.delta
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </td>
                                                                                                                                                                                                                                                                                                <td className="py-3">
                                                                                                                                                                                                                                                                                                                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                        row.status
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                </td>
                                                                                                                                                                                                                                                                        </tr>
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </tbody>
                                                                                                                                                                        </table>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 3: Team Workflow Intelligence (Feature 22) */}
                                                                        {activeTab ===
                                                                                                'workflow' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                PR
                                                                                                                                                                                                Lead
                                                                                                                                                                                                Time
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-extrabold text-white mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        workflowData.prLeadTime
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-xs text-emerald-400 mt-2 font-semibold">
                                                                                                                                                                                                Top
                                                                                                                                                                                                10%
                                                                                                                                                                                                Fast
                                                                                                                                                                                                Reviewers
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                Deploy
                                                                                                                                                                                                Frequency
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-extrabold text-cyan-400 mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        workflowData.deployFrequency
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-xs text-cyan-300 mt-2 font-semibold">
                                                                                                                                                                                                Continuous
                                                                                                                                                                                                Delivery
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                Burnout
                                                                                                                                                                                                Risk
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        workflowData.burnoutRisk
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-xs text-slate-400 mt-2">
                                                                                                                                                                                                Balanced
                                                                                                                                                                                                workload
                                                                                                                                                                                                distribution
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                Productivity
                                                                                                                                                                                                Tier
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-extrabold text-indigo-400 mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        workflowData.productivityPercentile
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-xs text-slate-400 mt-2">
                                                                                                                                                                                                High
                                                                                                                                                                                                velocity
                                                                                                                                                                                                engineering
                                                                                                                                                                                                team
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                <h3 className="text-sm font-bold text-white mb-4">
                                                                                                                                                                        Detected
                                                                                                                                                                        Workflow
                                                                                                                                                                        Bottlenecks
                                                                                                                                                                        &
                                                                                                                                                                        Optimization
                                                                                                                                                                        Actions
                                                                                                                                                </h3>
                                                                                                                                                <div className="space-y-4">
                                                                                                                                                                        {workflowData.bottlenecks.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        item,
                                                                                                                                                                                                                        i
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        i
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="flex items-start justify-between bg-slate-950 p-4 rounded-xl border border-slate-800"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        <div className="flex items-center gap-2">
                                                                                                                                                                                                                                                                                                <span className="text-sm font-bold text-white">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                item.stage
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                item.time
                                                                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                                                                        lead
                                                                                                                                                                                                                                                                                                                        time
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <p className="text-xs text-slate-400 mt-1">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        item.rec
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold">
                                                                                                                                                                                                                                                                        Apply
                                                                                                                                                                                                                                                                        Fix
                                                                                                                                                                                                                                                </button>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 4: Technical Debt Benchmarking (Feature 24) */}
                                                                        {activeTab === 'debt' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                Total
                                                                                                                                                                                                Refactoring
                                                                                                                                                                                                Hours
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-extrabold text-amber-400 mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        techDebt.totalHours
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-xs text-slate-400 mt-2">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        techDebt.density
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                Financial
                                                                                                                                                                                                Remediation
                                                                                                                                                                                                Cost
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-extrabold text-white mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        techDebt.remediationCost
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-xs text-emerald-400 mt-2">
                                                                                                                                                                                                Based
                                                                                                                                                                                                on
                                                                                                                                                                                                $115/hr
                                                                                                                                                                                                developer
                                                                                                                                                                                                rate
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                Global
                                                                                                                                                                                                Debt
                                                                                                                                                                                                Benchmark
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        techDebt.percentile
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-xs text-slate-400 mt-2">
                                                                                                                                                                                                Significantly
                                                                                                                                                                                                lower
                                                                                                                                                                                                debt
                                                                                                                                                                                                than
                                                                                                                                                                                                industry
                                                                                                                                                                                                average
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 5: Scalability Benchmarking (Feature 25) */}
                                                                        {activeTab ===
                                                                                                'scalability' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                                                                                                                                                <div>
                                                                                                                                                                        <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                                                                                                                                                                                                Scalability
                                                                                                                                                                                                Readiness
                                                                                                                                                                                                Index
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-4xl font-extrabold text-white mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        scalability.readinessScore
                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                <span className="text-lg font-normal text-slate-400">
                                                                                                                                                                                                                        /
                                                                                                                                                                                                                        100
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-xs text-slate-400 mt-1">
                                                                                                                                                                                                Maximum
                                                                                                                                                                                                Throughput:{' '}
                                                                                                                                                                                                <span className="text-white font-bold">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                scalability.maxRps
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-950 px-6 py-4 rounded-xl border border-slate-800 text-xs space-y-1">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <span className="text-slate-400">
                                                                                                                                                                                                                        Horizontal
                                                                                                                                                                                                                        Scaling:
                                                                                                                                                                                                </span>{' '}
                                                                                                                                                                                                <span className="text-emerald-400 font-bold">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                scalability.horizontalStatus
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div>
                                                                                                                                                                                                <span className="text-slate-400">
                                                                                                                                                                                                                        Memory
                                                                                                                                                                                                                        Leak
                                                                                                                                                                                                                        Risk:
                                                                                                                                                                                                </span>{' '}
                                                                                                                                                                                                <span className="text-cyan-400 font-bold">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                scalability.memoryRisk
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 6: Reliability Benchmarking (Feature 26) */}
                                                                        {activeTab ===
                                                                                                'reliability' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                Reliability
                                                                                                                                                                                                Index
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        reliability.index
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-xs text-slate-400 mt-2">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        reliability.rating
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                Estimated
                                                                                                                                                                                                MTBF
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-extrabold text-white mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        reliability.mtbf
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-xs text-cyan-400 mt-2">
                                                                                                                                                                                                Mean
                                                                                                                                                                                                Time
                                                                                                                                                                                                Between
                                                                                                                                                                                                Failures
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                Circuit
                                                                                                                                                                                                Breaker
                                                                                                                                                                                                &
                                                                                                                                                                                                Fallbacks
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-extrabold text-indigo-400 mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        reliability.circuitBreakerCoverage
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-xs text-slate-400 mt-2">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        reliability.slaTier
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 7: Observability Benchmarking (Feature 27) */}
                                                                        {activeTab ===
                                                                                                'observability' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                <h3 className="text-sm font-bold text-white mb-4">
                                                                                                                                                                        Telemetry
                                                                                                                                                                        Coverage
                                                                                                                                                                        Breakdown
                                                                                                                                                </h3>
                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                                                                                                                                                                                <div className="text-xs text-slate-400">
                                                                                                                                                                                                                        Distributed
                                                                                                                                                                                                                        Tracing
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-2xl font-bold text-cyan-400 mt-1">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                observability.tracingCoverage
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                                                                                                                                                                                <div className="text-xs text-slate-400">
                                                                                                                                                                                                                        Structured
                                                                                                                                                                                                                        JSON
                                                                                                                                                                                                                        Logging
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-2xl font-bold text-emerald-400 mt-1">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                observability.structuredLogging
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                                                                                                                                                                                <div className="text-xs text-slate-400">
                                                                                                                                                                                                                        Alert
                                                                                                                                                                                                                        Signal-to-Noise
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="text-2xl font-bold text-indigo-400 mt-1">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                observability.signalToNoise
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 8: Release Maturity Benchmarking (Feature 28) */}
                                                                        {activeTab ===
                                                                                                'release' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                DORA
                                                                                                                                                                                                Performance
                                                                                                                                                                                                Tier
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-extrabold text-indigo-400 mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        releaseMaturity.doraTier
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-xs text-emerald-400 mt-2">
                                                                                                                                                                                                Continuous
                                                                                                                                                                                                Automated
                                                                                                                                                                                                Deployment
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                Mean
                                                                                                                                                                                                Time
                                                                                                                                                                                                To
                                                                                                                                                                                                Restore
                                                                                                                                                                                                (MTTR)
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-extrabold text-white mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        releaseMaturity.mttrMinutes
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-xs text-slate-400 mt-2">
                                                                                                                                                                                                Automated
                                                                                                                                                                                                Instant
                                                                                                                                                                                                Rollback
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                                        <div className="text-slate-400 text-xs font-medium uppercase">
                                                                                                                                                                                                Change
                                                                                                                                                                                                Failure
                                                                                                                                                                                                Rate
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        releaseMaturity.changeFailureRate
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="text-xs text-slate-400 mt-2">
                                                                                                                                                                                                Feature
                                                                                                                                                                                                flag
                                                                                                                                                                                                isolation
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 9: AI Recommendation Confidence Engine (Feature 29) */}
                                                                        {activeTab ===
                                                                                                'ai_confidence' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                <div className="flex items-center justify-between mb-4">
                                                                                                                                                                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                                                                                                                                                                <BrainCircuit className="w-5 h-5 text-indigo-400" />{' '}
                                                                                                                                                                                                AI
                                                                                                                                                                                                Recommendation
                                                                                                                                                                                                Confidence
                                                                                                                                                                                                Inspector
                                                                                                                                                                        </h3>
                                                                                                                                                                        <span className="text-xs font-bold px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        aiConfidence.scorePct
                                                                                                                                                                                                }

                                                                                                                                                                                                %{' '}
                                                                                                                                                                                                {
                                                                                                                                                                                                                        aiConfidence.tier
                                                                                                                                                                                                }
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <p className="text-xs text-slate-400 mb-4">
                                                                                                                                                                        Multi-source
                                                                                                                                                                        evidence
                                                                                                                                                                        provenance
                                                                                                                                                                        proving
                                                                                                                                                                        recommendation
                                                                                                                                                                        safety
                                                                                                                                                                        before
                                                                                                                                                                        applying
                                                                                                                                                                        code
                                                                                                                                                                        refactorings.
                                                                                                                                                </p>

                                                                                                                                                <div className="space-y-3">
                                                                                                                                                                        {aiConfidence.evidence.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        item,
                                                                                                                                                                                                                        i
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        i
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start justify-between"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        <div className="text-xs font-bold text-indigo-300">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        item.source
                                                                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                                                                <span className="text-slate-500 font-normal">
                                                                                                                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                item.weight
                                                                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                                                                        weight)
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <div className="text-xs text-slate-300 mt-1">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        item.finding
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 10: Industry-Specific Recommendations (Feature 30) */}
                                                                        {activeTab ===
                                                                                                'industry' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                                                                                                                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                                                                                                                                                                                        <Building2 className="w-5 h-5 text-indigo-400" />{' '}
                                                                                                                                                                                                                        Industry
                                                                                                                                                                                                                        &
                                                                                                                                                                                                                        Compliance
                                                                                                                                                                                                                        Standards
                                                                                                                                                                                                                        Benchmarking
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <p className="text-xs text-slate-400 mt-1">
                                                                                                                                                                                                                        Tailors
                                                                                                                                                                                                                        architectural
                                                                                                                                                                                                                        guidelines
                                                                                                                                                                                                                        and
                                                                                                                                                                                                                        regulatory
                                                                                                                                                                                                                        checks
                                                                                                                                                                                                                        to
                                                                                                                                                                                                                        specific
                                                                                                                                                                                                                        vertical
                                                                                                                                                                                                                        domains.
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="flex items-center gap-2">
                                                                                                                                                                                                {[
                                                                                                                                                                                                                        'FinTech',
                                                                                                                                                                                                                        'HealthTech',
                                                                                                                                                                                                                        'CyberSecurity',
                                                                                                                                                                                                                        'Cloud-Native SaaS',
                                                                                                                                                                                                ].map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                ind
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <button
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                ind
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                                                                setSelectedIndustry(
                                                                                                                                                                                                                                                                                                                        ind
                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                                                                                                                                                                                                                                                                                selectedIndustry ===
                                                                                                                                                                                                                                                                                                ind
                                                                                                                                                                                                                                                                                                                        ? 'bg-indigo-600 text-white shadow'
                                                                                                                                                                                                                                                                                                                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                                                                                                                                                                                                                                                                        }`}
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                ind
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </button>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                                                                                                                                                        {currentIndustryData.standards.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        std: any,
                                                                                                                                                                                                                        idx: number
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-950 p-4 rounded-xl border border-slate-800"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div className="text-xs text-slate-400">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                std.name
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div className="text-xl font-bold text-emerald-400 mt-1">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                std.pct
                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                        Compliant
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <span className="inline-block mt-2 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                std.status
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>

                                                                                                                                                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                                                                                                                                                                        Tailored
                                                                                                                                                                        Domain
                                                                                                                                                                        Recommendations
                                                                                                                                                </h4>
                                                                                                                                                <ul className="space-y-2">
                                                                                                                                                                        {currentIndustryData.recommendations.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        rec: string,
                                                                                                                                                                                                                        idx: number
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <li
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="flex items-start gap-2.5 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-200"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                rec
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </li>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </ul>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}
                                                </div>
                        );
}
