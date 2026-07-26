'use client';

import React, { useState } from 'react';
import {
                        Dna,
                        Activity,
                        Sparkles,
                        Shield,
                        Layers,
                        Cpu,
                        Zap,
                        CheckCircle2,
                        Share2,
                        FileCode,
                        LineChart,
                        Brain,
                        Gauge,
                        Database,
                        Cloud,
                        Terminal,
                        Fingerprint,
                        GitCommit,
                        TrendingUp,
                        AlertTriangle,
                        History,
                        GitCompare,
                        Building2,
                        AlertCircle,
                        ShieldAlert,
                        GitFork,
                        Lightbulb,
                        Grid,
                        Boxes,
                        Code2,
                        Package,
                        Play,
                        FileDiff,
                        Award,
} from 'lucide-react';

export default function EngineeringDigitalGenomePage() {
                        const [activeTab, setActiveTab] = useState<string>('dnaExplorer');

                        // 🌟 The "Wow" Feature Genome Profile Data
                        const livingGenomeProfile = {
                                                repositoryName: 'CodeAtlas Core Enterprise Backend',
                                                organismType: 'High-Scale Resilient Cloud Native Microservice',
                                                dnaString: 'ARCH-12 • PERF-8 • SEC-15 • TEST-11 • DATA-4 • OBS-9 • AI-3 • DX-7 • SCAL-10 • CLOUD-8',
                                                fingerprintHash: 'dna_sha256_8f9a2e41b7c3d05e81f92a4b12c8e',
                                                compatibility: '96.8%',
                                                verdict: 'GENOME_SEQUENCING_SUCCESSFUL_OPTIMAL_ORGANISM',
                                                livingGenomeScores: [
                                                                        {
                                                                                                name: 'Architecture',
                                                                                                score: 96,
                                                                                                gauge: '██████████ 96%',
                                                                                                color: 'text-emerald-400',
                                                                                                bar: 'bg-emerald-500',
                                                                                                status: 'Optimal',
                                                                        },
                                                                        {
                                                                                                name: 'Security',
                                                                                                score: 82,
                                                                                                gauge: '████████░░ 82%',
                                                                                                color: 'text-cyan-400',
                                                                                                bar: 'bg-cyan-500',
                                                                                                status: 'Good',
                                                                        },
                                                                        {
                                                                                                name: 'Scalability',
                                                                                                score: 91,
                                                                                                gauge: '█████████░ 91%',
                                                                                                color: 'text-indigo-400',
                                                                                                bar: 'bg-indigo-500',
                                                                                                status: 'Optimal',
                                                                        },
                                                                        {
                                                                                                name: 'Testing',
                                                                                                score: 63,
                                                                                                gauge: '██████░░░░ 63%',
                                                                                                color: 'text-rose-400',
                                                                                                bar: 'bg-rose-500',
                                                                                                status: 'Needs Review',
                                                                        },
                                                                        {
                                                                                                name: 'Reliability',
                                                                                                score: 90,
                                                                                                gauge: '█████████░ 90%',
                                                                                                color: 'text-teal-400',
                                                                                                bar: 'bg-teal-500',
                                                                                                status: 'Optimal',
                                                                        },
                                                                        {
                                                                                                name: 'AI Readiness',
                                                                                                score: 75,
                                                                                                gauge: '███████░░░ 75%',
                                                                                                color: 'text-purple-400',
                                                                                                bar: 'bg-purple-500',
                                                                                                status: 'Good',
                                                                        },
                                                                        {
                                                                                                name: 'Observability',
                                                                                                score: 89,
                                                                                                gauge: '█████████░ 89%',
                                                                                                color: 'text-amber-400',
                                                                                                bar: 'bg-amber-500',
                                                                                                status: 'Optimal',
                                                                        },
                                                ],
                                                mutationReplays: [
                                                                        {
                                                                                                step: 1,
                                                                                                sha: 'c3a1b8e',
                                                                                                author: 'alex_dev',
                                                                                                desc: 'Upgraded Auth Vault to RS256 token rotation protocol.',
                                                                                                delta: '+2.4%',
                                                                        },
                                                                        {
                                                                                                step: 2,
                                                                                                sha: 'e5f6g7h',
                                                                                                author: 'sarah_sec',
                                                                                                desc: 'Injected gRPC Protobuf binary streaming.',
                                                                                                delta: '+3.8%',
                                                                        },
                                                ],
                                                genomeDiffs: [
                                                                        {
                                                                                                gene: 'SEC-15',
                                                                                                cat: 'Security',
                                                                                                oldS: 65,
                                                                                                newS: 82,
                                                                                                delta: '+17.0%',
                                                                                                status: 'Improved',
                                                                        },
                                                                        {
                                                                                                gene: 'PERF-8',
                                                                                                cat: 'Performance',
                                                                                                oldS: 72,
                                                                                                newS: 91,
                                                                                                delta: '+19.0%',
                                                                                                status: 'Improved',
                                                                        },
                                                                        {
                                                                                                gene: 'TEST-11',
                                                                                                cat: 'Testing',
                                                                                                oldS: 68,
                                                                                                newS: 63,
                                                                                                delta: '-5.0%',
                                                                                                status: 'Regressed',
                                                                        },
                                                ],
                                                executiveReport: {
                                                                        health: '94.8%',
                                                                        summary: 'The enterprise codebase exhibits strong genetic fitness across Security (82%) and Scalability (91%). Testing (63%) is targeted for Q3 refactoring.',
                                                                        diversity: '88.5 / 100',
                                                                        investments: [
                                                                                                'Expand test coverage contract suites for Checkout & Payments',
                                                                                                'Maintain gRPC Protobuf binary streaming velocity',
                                                                        ],
                                                },
                        };

                        return (
                                                <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
                                                                        {/* Top Banner Header */}
                                                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
                                                                                                <div>
                                                                                                                        <div className="flex items-center gap-3 mb-2">
                                                                                                                                                <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl text-emerald-400">
                                                                                                                                                                        <Dna className="w-8 h-8 animate-pulse" />
                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                                                                                                                                                                                🌟
                                                                                                                                                                                                WOW
                                                                                                                                                                                                Feature
                                                                                                                                                                                                —
                                                                                                                                                                                                Phase
                                                                                                                                                                                                28
                                                                                                                                                                                                Organism
                                                                                                                                                                                                Finale
                                                                                                                                                                        </span>
                                                                                                                                                                        <h1 className="text-3xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
                                                                                                                                                                                                Repository
                                                                                                                                                                                                DNA
                                                                                                                                                                                                Explorer
                                                                                                                                                                        </h1>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                        <p className="text-slate-400 text-sm max-w-3xl">
                                                                                                                                                "Open
                                                                                                                                                a
                                                                                                                                                repository
                                                                                                                                                and
                                                                                                                                                watch
                                                                                                                                                the
                                                                                                                                                software
                                                                                                                                                evolve
                                                                                                                                                like
                                                                                                                                                a
                                                                                                                                                living
                                                                                                                                                organism
                                                                                                                                                across
                                                                                                                                                Architecture,
                                                                                                                                                Security,
                                                                                                                                                Scalability,
                                                                                                                                                Testing,
                                                                                                                                                Reliability,
                                                                                                                                                AI
                                                                                                                                                Readiness,
                                                                                                                                                and
                                                                                                                                                Observability."
                                                                                                                        </p>
                                                                                                </div>

                                                                                                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-xs">
                                                                                                                        <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                                                                                                                        <div>
                                                                                                                                                <div className="text-slate-400">
                                                                                                                                                                        Overall
                                                                                                                                                                        Health
                                                                                                                                                </div>
                                                                                                                                                <div className="text-sm font-bold text-emerald-400">
                                                                                                                                                                        {
                                                                                                                                                                                                livingGenomeProfile
                                                                                                                                                                                                                        .executiveReport
                                                                                                                                                                                                                        .health
                                                                                                                                                                        }{' '}
                                                                                                                                                                        Optimal
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Tabs */}
                                                                        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-thin">
                                                                                                {[
                                                                                                                        {
                                                                                                                                                id: 'dnaExplorer',
                                                                                                                                                label: '🧬 Repository Genome (Living Organism)',
                                                                                                                                                icon: Dna,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'replayDiff',
                                                                                                                                                label: '⭐ 32 & 44. Mutation Replay & Genome Diff',
                                                                                                                                                icon: Play,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'executive',
                                                                                                                                                label: '⭐ 41. Executive Genome Report & Biodiversity',
                                                                                                                                                icon: Award,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'chromosomes',
                                                                                                                                                label: '⭐ 16. Code Chromosomes',
                                                                                                                                                icon: Code2,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'specialized',
                                                                                                                                                label: '⭐ 17–30. 14 Specialized Genomes',
                                                                                                                                                icon: Boxes,
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
                                                                                                                                                                                                                                                ? 'bg-emerald-600 text-white font-black shadow-lg shadow-emerald-500/20'
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

                                                                        {/* 🌟 TAB 1: The "Wow" Feature: Repository DNA Explorer Canvas */}
                                                                        {activeTab ===
                                                                                                'dnaExplorer' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-3xl p-8 space-y-6 shadow-2xl">
                                                                                                                                                <div className="flex items-center justify-between">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                                                                                                                                                                                                                        🧬
                                                                                                                                                                                                                        Repository
                                                                                                                                                                                                                        Genome
                                                                                                                                                                                                                        (Every
                                                                                                                                                                                                                        commit
                                                                                                                                                                                                                        updates
                                                                                                                                                                                                                        the
                                                                                                                                                                                                                        genome
                                                                                                                                                                                                                        over
                                                                                                                                                                                                                        months
                                                                                                                                                                                                                        and
                                                                                                                                                                                                                        years)
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <h2 className="text-2xl font-black text-white mt-1">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                livingGenomeProfile.repositoryName
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </h2>
                                                                                                                                                                        </div>
                                                                                                                                                                        <span className="px-4 py-2 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-black rounded-2xl">
                                                                                                                                                                                                Age:
                                                                                                                                                                                                780
                                                                                                                                                                                                Days
                                                                                                                                                                                                (1,420
                                                                                                                                                                                                Commits
                                                                                                                                                                                                Sequenced)
                                                                                                                                                                        </span>
                                                                                                                                                </div>

                                                                                                                                                {/* Living Genome ASCII & Score Grid */}
                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                                                                                                                                                                        {livingGenomeProfile.livingGenomeScores.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        scoreItem,
                                                                                                                                                                                                                        idx
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-lg hover:border-emerald-500/40 transition-all"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div className="flex items-center justify-between">
                                                                                                                                                                                                                                                                        <span className="text-xs font-bold text-slate-300">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        scoreItem.name
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <span
                                                                                                                                                                                                                                                                                                className={`text-xs font-bold ${scoreItem.color}`}
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        scoreItem.score
                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                %
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                                                                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                                                                className={`${scoreItem.bar} h-full transition-all duration-500`}
                                                                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                                                                        width: `${scoreItem.score}%`,
                                                                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                                                                        />
                                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                                <div className="font-mono text-xs font-black tracking-widest text-emerald-400 bg-slate-900 p-2 rounded-xl border border-slate-800 text-center">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                scoreItem.gauge
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>

                                                                                                                                                <p className="text-xs text-slate-400 text-center font-mono">
                                                                                                                                                                        "Over
                                                                                                                                                                        months
                                                                                                                                                                        and
                                                                                                                                                                        years,
                                                                                                                                                                        you
                                                                                                                                                                        watch
                                                                                                                                                                        the
                                                                                                                                                                        software
                                                                                                                                                                        evolve
                                                                                                                                                                        like
                                                                                                                                                                        a
                                                                                                                                                                        living
                                                                                                                                                                        organism."
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 2: Mutation Replay & Genome Diff */}
                                                                        {activeTab ===
                                                                                                'replayDiff' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6">
                                                                                                                                                <div className="flex items-center justify-between">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                                                                                                                                                                                                                        ⭐
                                                                                                                                                                                                                        32.
                                                                                                                                                                                                                        Mutation
                                                                                                                                                                                                                        Replay
                                                                                                                                                                                                                        &
                                                                                                                                                                                                                        ⭐
                                                                                                                                                                                                                        44.
                                                                                                                                                                                                                        Genome
                                                                                                                                                                                                                        Diff
                                                                                                                                                                                                                        Visualization
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <h3 className="text-xl font-black text-white mt-1">
                                                                                                                                                                                                                        Step-by-Step
                                                                                                                                                                                                                        Commit
                                                                                                                                                                                                                        Mutation
                                                                                                                                                                                                                        History
                                                                                                                                                                                                </h3>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                                                                                                                                                                        <div className="space-y-3">
                                                                                                                                                                                                <span className="text-cyan-400 font-bold uppercase text-[10px]">
                                                                                                                                                                                                                        Mutation
                                                                                                                                                                                                                        Replay
                                                                                                                                                                                                                        Steps:
                                                                                                                                                                                                </span>
                                                                                                                                                                                                {livingGenomeProfile.mutationReplays.map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                mr,
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1"
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        <div className="font-mono text-cyan-400 font-bold">
                                                                                                                                                                                                                                                                                                Step{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        mr.step
                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                :{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        mr.sha
                                                                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        mr.author
                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <div className="text-slate-200">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        mr.desc
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <span className="inline-block text-emerald-400 font-bold mt-1">
                                                                                                                                                                                                                                                                                                Delta:{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        mr.delta
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="space-y-3">
                                                                                                                                                                                                <span className="text-emerald-400 font-bold uppercase text-[10px]">
                                                                                                                                                                                                                        Genome
                                                                                                                                                                                                                        Diff
                                                                                                                                                                                                                        Visualization:
                                                                                                                                                                                                </span>
                                                                                                                                                                                                {livingGenomeProfile.genomeDiffs.map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                gd,
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1"
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        <div className="font-bold text-white">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        gd.gene
                                                                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        gd.cat
                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <div className="text-slate-400">
                                                                                                                                                                                                                                                                                                Score
                                                                                                                                                                                                                                                                                                Shift:{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        gd.oldS
                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                %
                                                                                                                                                                                                                                                                                                ➔{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        gd.newS
                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                %
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <span
                                                                                                                                                                                                                                                                                                className={`inline-block font-bold mt-1 ${gd.status === 'Improved' ? 'text-emerald-400' : 'text-rose-400'}`}
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        gd.status
                                                                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        gd.delta
                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 3: Executive Genome Report & Biodiversity */}
                                                                        {activeTab ===
                                                                                                'executive' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6">
                                                                                                                                                <div className="flex items-center justify-between">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                                                                                                                                                                                                                        ⭐
                                                                                                                                                                                                                        41.
                                                                                                                                                                                                                        Executive
                                                                                                                                                                                                                        Genome
                                                                                                                                                                                                                        Report
                                                                                                                                                                                                                        &
                                                                                                                                                                                                                        Biodiversity
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <h3 className="text-xl font-black text-white mt-1">
                                                                                                                                                                                                                        Strategic
                                                                                                                                                                                                                        Leadership
                                                                                                                                                                                                                        Briefing
                                                                                                                                                                                                </h3>
                                                                                                                                                                        </div>
                                                                                                                                                                        <span className="text-xl font-black text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 rounded-2xl">
                                                                                                                                                                                                Biodiversity:{' '}
                                                                                                                                                                                                {
                                                                                                                                                                                                                        livingGenomeProfile
                                                                                                                                                                                                                                                .executiveReport
                                                                                                                                                                                                                                                .diversity
                                                                                                                                                                                                }
                                                                                                                                                                        </span>
                                                                                                                                                </div>

                                                                                                                                                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
                                                                                                                                                                        <span className="text-slate-400 font-bold uppercase text-[10px]">
                                                                                                                                                                                                Executive
                                                                                                                                                                                                Summary:
                                                                                                                                                                        </span>
                                                                                                                                                                        <p className="text-slate-200 leading-relaxed">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        livingGenomeProfile
                                                                                                                                                                                                                                                .executiveReport
                                                                                                                                                                                                                                                .summary
                                                                                                                                                                                                }
                                                                                                                                                                        </p>
                                                                                                                                                                        <div className="pt-2">
                                                                                                                                                                                                <span className="text-emerald-400 font-bold uppercase text-[10px]">
                                                                                                                                                                                                                        Strategic
                                                                                                                                                                                                                        Investment
                                                                                                                                                                                                                        Recommendations:
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <ul className="list-disc list-inside text-slate-300 space-y-1 mt-1 font-medium">
                                                                                                                                                                                                                        {livingGenomeProfile.executiveReport.investments.map(
                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                        inv,
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                                                                        <li
                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        inv
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </li>
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </ul>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 4: Chromosomes */}
                                                                        {activeTab ===
                                                                                                'chromosomes' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6">
                                                                                                                                                <h3 className="text-xl font-black text-white">
                                                                                                                                                                        Code
                                                                                                                                                                        Chromosomes
                                                                                                                                                </h3>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 5: Specialized Genomes */}
                                                                        {activeTab ===
                                                                                                'specialized' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6">
                                                                                                                                                <h3 className="text-xl font-black text-white">
                                                                                                                                                                        14
                                                                                                                                                                        Specialized
                                                                                                                                                                        Genomes
                                                                                                                                                </h3>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}
                                                </div>
                        );
}
