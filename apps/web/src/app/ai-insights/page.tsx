'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
                        Sparkles,
                        ShieldAlert,
                        Flame,
                        Zap,
                        FileCode,
                        Network,
                        CheckCircle2,
                        Eye,
                        Play,
                        XCircle,
                        ExternalLink,
                        SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AIInsightsPage() {
                        const [activeCategory, setActiveCategory] = useState<string>('all');
                        const [dismissedIds, setDismissedIds] = useState<string[]>([]);

                        const insights = [
                                                {
                                                                        id: 'ins-1',
                                                                        category: 'architecture',
                                                                        title: 'Decouple SQLAlchemy Queries from REST Router',
                                                                        description: 'Direct database queries inside FastAPI route handlers violate Clean Architecture and introduce tight database coupling.',
                                                                        severity: 'HIGH',
                                                                        confidence: 95.8,
                                                                        effort: '2.0 hours',
                                                                        impact: '$18,500/yr Debt Drag',
                                                                        evidence: 'apps/backend/app/api/v1/asip_router.py:L45-68',
                                                },
                                                {
                                                                        id: 'ins-2',
                                                                        category: 'tech_debt',
                                                                        title: 'Migrate Class-based Configs to Pydantic V2 ConfigDict',
                                                                        description: 'Legacy class-based Config classes generate 57 Pydantic V2 deprecation warnings on application startup.',
                                                                        severity: 'MEDIUM',
                                                                        confidence: 99.1,
                                                                        effort: '1.0 hour',
                                                                        impact: 'Zero Deprecation Warnings',
                                                                        evidence: 'apps/backend/app/schemas/oip.py:L105-122',
                                                },
                                                {
                                                                        id: 'ins-3',
                                                                        category: 'performance',
                                                                        title: 'Introduce Redis Cluster for Auth Token Cache',
                                                                        description: 'DB token lookup latency peaks at 42ms during high concurrency. Redis caching will reduce check times to <1ms.',
                                                                        severity: 'HIGH',
                                                                        confidence: 94.2,
                                                                        effort: '4.0 hours',
                                                                        impact: '+350% Auth Throughput',
                                                                        evidence: 'apps/backend/app/api/v1/auth.py:L30-55',
                                                },
                                                {
                                                                        id: 'ins-4',
                                                                        category: 'security',
                                                                        title: 'Enforce JWT Secret Key Rotation Policy',
                                                                        description: 'Hardcoded stub secret key detected in config fallback default settings.',
                                                                        severity: 'CRITICAL',
                                                                        confidence: 99.8,
                                                                        effort: '0.5 hours',
                                                                        impact: 'SOC2 Security Compliance',
                                                                        evidence: 'apps/backend/app/core/config.py:L11',
                                                },
                                                {
                                                                        id: 'ins-5',
                                                                        category: 'dependency',
                                                                        title: 'Update Starlette Dependency to V0.38+',
                                                                        description: 'Starlette testclient warning detected during integration test execution.',
                                                                        severity: 'LOW',
                                                                        confidence: 91.0,
                                                                        effort: '0.5 hours',
                                                                        impact: 'Test Suite Cleanliness',
                                                                        evidence: 'pyproject.toml:L18',
                                                },
                                                {
                                                                        id: 'ins-6',
                                                                        category: 'documentation',
                                                                        title: 'Add OpenAPI Schema Descriptions for ASIP Routers',
                                                                        description: '12 endpoint parameters lack explicit documentation strings in public OpenAPI JSON.',
                                                                        severity: 'LOW',
                                                                        confidence: 88.4,
                                                                        effort: '1.5 hours',
                                                                        impact: '+12% Developer Experience',
                                                                        evidence: 'apps/backend/app/api/v1/asip_router.py:L200-240',
                                                },
                        ];

                        const handleDismiss = (id: string) => {
                                                setDismissedIds((prev) => [...prev, id]);
                        };

                        const filteredInsights = insights.filter((ins) => {
                                                if (dismissedIds.includes(ins.id)) return false;
                                                if (activeCategory === 'all') return true;
                                                return ins.category === activeCategory;
                        });

                        return (
                                                <div className="min-h-screen bg-background text-foreground p-8 space-y-8 max-w-7xl mx-auto">
                                                                        {/* Page Header */}
                                                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                                                                                                <div className="space-y-1">
                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                <h1 className="text-3xl font-black tracking-tight text-foreground">
                                                                                                                                                                        🤖
                                                                                                                                                                        Enterprise
                                                                                                                                                                        AI
                                                                                                                                                                        Insights
                                                                                                                                                </h1>
                                                                                                                                                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-black rounded-full uppercase tracking-wider">
                                                                                                                                                                        CONTINUOUS
                                                                                                                                                                        MONITORING
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <p className="text-sm text-muted-foreground">
                                                                                                                                                Continuous
                                                                                                                                                automated
                                                                                                                                                architecture,
                                                                                                                                                technical
                                                                                                                                                debt,
                                                                                                                                                security,
                                                                                                                                                and
                                                                                                                                                performance
                                                                                                                                                recommendations.
                                                                                                                        </p>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Filter Toggles */}
                                                                        <div className="flex border-b overflow-x-auto gap-2">
                                                                                                {[
                                                                                                                        {
                                                                                                                                                id: 'all',
                                                                                                                                                label: 'All Insights',
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'architecture',
                                                                                                                                                label: '🏛️ Architecture',
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'tech_debt',
                                                                                                                                                label: '🔥 Technical Debt',
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'security',
                                                                                                                                                label: '🔒 Security',
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'performance',
                                                                                                                                                label: '⚡ Performance',
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'dependency',
                                                                                                                                                label: '🕸️ Dependencies',
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'documentation',
                                                                                                                                                label: '📄 Documentation',
                                                                                                                        },
                                                                                                ].map(
                                                                                                                        (
                                                                                                                                                tab
                                                                                                                        ) => (
                                                                                                                                                <button
                                                                                                                                                                        key={
                                                                                                                                                                                                tab.id
                                                                                                                                                                        }
                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                setActiveCategory(
                                                                                                                                                                                                                        tab.id
                                                                                                                                                                                                )
                                                                                                                                                                        }
                                                                                                                                                                        className={`pb-3 px-5 text-xs font-extrabold border-b-2 transition-all ${
                                                                                                                                                                                                activeCategory ===
                                                                                                                                                                                                tab.id
                                                                                                                                                                                                                        ? 'border-primary text-primary'
                                                                                                                                                                                                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                                                                                                                                                        }`}
                                                                                                                                                >
                                                                                                                                                                        {
                                                                                                                                                                                                tab.label
                                                                                                                                                                        }
                                                                                                                                                </button>
                                                                                                                        )
                                                                                                )}
                                                                        </div>

                                                                        {/* Insights List */}
                                                                        <div className="space-y-4">
                                                                                                {filteredInsights.map(
                                                                                                                        (
                                                                                                                                                ins
                                                                                                                        ) => (
                                                                                                                                                <div
                                                                                                                                                                        key={
                                                                                                                                                                                                ins.id
                                                                                                                                                                        }
                                                                                                                                                                        className="border rounded-2xl bg-card p-6 shadow-sm hover:border-primary/40 transition-all space-y-4"
                                                                                                                                                >
                                                                                                                                                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b pb-3">
                                                                                                                                                                                                <div className="flex items-center gap-3">
                                                                                                                                                                                                                        <span
                                                                                                                                                                                                                                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                                                                                                                                                                                                                                                        ins.severity ===
                                                                                                                                                                                                                                                                        'CRITICAL'
                                                                                                                                                                                                                                                                                                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                                                                                                                                                                                                                                                                                : ins.severity ===
                                                                                                                                                                                                                                                                                                    'HIGH'
                                                                                                                                                                                                                                                                                                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                                                                                                                                                                                                                                                                                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                                                                                                                                                                                                                                                }`}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        ins.severity
                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                SEVERITY
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <h3 className="text-base font-extrabold text-foreground">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        ins.title
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </h3>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div className="flex items-center gap-4 text-xs">
                                                                                                                                                                                                                        <span className="font-extrabold text-indigo-400">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        ins.confidence
                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                %
                                                                                                                                                                                                                                                Confidence
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-muted-foreground font-mono">
                                                                                                                                                                                                                                                Effort:{' '}
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        ins.effort
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        ins.description
                                                                                                                                                                                                }
                                                                                                                                                                        </p>

                                                                                                                                                                        <div className="flex items-center justify-between text-xs pt-2">
                                                                                                                                                                                                <span className="text-muted-foreground font-mono text-[11px]">
                                                                                                                                                                                                                        Source:{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                ins.evidence
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="font-extrabold text-emerald-400">
                                                                                                                                                                                                                        Business
                                                                                                                                                                                                                        Impact:{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                ins.impact
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>

                                                                                                                                                                        {/* 1-Click Action Bar */}
                                                                                                                                                                        <div className="flex flex-wrap items-center gap-2 pt-3 border-t">
                                                                                                                                                                                                <Button
                                                                                                                                                                                                                        size="sm"
                                                                                                                                                                                                                        variant="outline"
                                                                                                                                                                                                                        className="text-xs font-bold gap-1"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <Eye className="h-3.5 w-3.5" />{' '}
                                                                                                                                                                                                                        Preview
                                                                                                                                                                                                                        Code
                                                                                                                                                                                                </Button>
                                                                                                                                                                                                <Link href="/mission-control">
                                                                                                                                                                                                                        <Button
                                                                                                                                                                                                                                                size="sm"
                                                                                                                                                                                                                                                variant="outline"
                                                                                                                                                                                                                                                className="text-xs font-bold gap-1 text-indigo-400 border-indigo-500/30"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <Play className="h-3.5 w-3.5" />{' '}
                                                                                                                                                                                                                                                Simulate
                                                                                                                                                                                                                                                Impact
                                                                                                                                                                                                                        </Button>
                                                                                                                                                                                                </Link>
                                                                                                                                                                                                <Button
                                                                                                                                                                                                                        size="sm"
                                                                                                                                                                                                                        variant="outline"
                                                                                                                                                                                                                        className="text-xs font-bold gap-1 text-emerald-400 border-emerald-500/30"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <ExternalLink className="h-3.5 w-3.5" />{' '}
                                                                                                                                                                                                                        Create
                                                                                                                                                                                                                        Jira
                                                                                                                                                                                                                        Issue
                                                                                                                                                                                                </Button>
                                                                                                                                                                                                <Button
                                                                                                                                                                                                                        size="sm"
                                                                                                                                                                                                                        variant="ghost"
                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                handleDismiss(
                                                                                                                                                                                                                                                                        ins.id
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="text-xs font-bold gap-1 text-muted-foreground hover:text-red-400"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <XCircle className="h-3.5 w-3.5" />{' '}
                                                                                                                                                                                                                        Dismiss
                                                                                                                                                                                                </Button>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        )
                                                                                                )}
                                                                        </div>
                                                </div>
                        );
}
