'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
                        Zap,
                        Play,
                        CheckCircle2,
                        RefreshCw,
                        Database,
                        Layers,
                        BarChart,
                        ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EngineeringSimulationStudio } from '@/components/ui/engineering-simulation-studio';

export default function SimulateWorkflowPage() {
	const [activeTab, setActiveTab] = useState<'studio' | 'load' | 'refactor' | 'schema'>(
		'studio'
	);
	const [simulating, setSimulating] = useState<boolean>(false);
	const [simData, setSimData] = useState<any>(null);

	const handleRunSim = () => {
		setSimulating(true);
		setTimeout(() => {
			setSimData({
				scenario: '1M to 100M User Growth Scenario',
				health_score: 94.0,
				bottlenecks: [
					'DB Connection Pool saturates at 15k concurrent requests',
					'Auth JWT validation latency spikes +45ms',
				],
				recommendations: [
					'Introduce Redis Cluster Auth Cache',
					'Decouple REST Router queries to async repository pattern',
				],
			});
			setSimulating(false);
		}, 1200);
	};

	return (
		<div className="space-y-6 max-w-7xl mx-auto pb-12">
			{/* Top Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-5">
				<div>
					<div className="flex items-center gap-3">
						<h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
							<Zap className="w-6 h-6 text-cyan-400" /> Engineering Simulation Studio
						</h1>
						<span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider">
							FIGMA + GOOGLE MAPS + AI ARCHITECT
						</span>
					</div>
					<p className="text-xs text-slate-400 mt-1">
						Simulate code changes, database migrations, package extractions, and traffic scaling safely before writing code.
					</p>
				</div>
			</div>

			{/* Sub-Workflow Navigation Tabs */}
			<div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 overflow-x-auto">
				<button
					onClick={() => setActiveTab('studio')}
					className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
						activeTab === 'studio'
							? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30 shadow-md font-bold'
							: 'text-slate-400 hover:bg-slate-900'
					}`}
				>
					<Zap className="h-4 w-4 text-cyan-400" /> Simulation Studio Canvas
				</button>
				<button
					onClick={() => setActiveTab('load')}
					className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
						activeTab === 'load'
							? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30 shadow-md font-bold'
							: 'text-slate-400 hover:bg-slate-900'
					}`}
				>
					<Play className="h-4 w-4 text-indigo-400" /> Load & Scale Tests
				</button>
				<button
					onClick={() => setActiveTab('refactor')}
					className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
						activeTab === 'refactor'
							? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30 shadow-md font-bold'
							: 'text-slate-400 hover:bg-slate-900'
					}`}
				>
					<Layers className="h-4 w-4 text-purple-400" /> Refactoring Impact
				</button>
				<button
					onClick={() => setActiveTab('schema')}
					className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
						activeTab === 'schema'
							? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30 shadow-md font-bold'
							: 'text-slate-400 hover:bg-slate-900'
					}`}
				>
					<Database className="h-4 w-4 text-emerald-400" /> Database Evolution
				</button>
			</div>

			{/* TAB CONTENT: Engineering Simulation Studio */}
			{activeTab === 'studio' && (
				<div className="py-1">
					<EngineeringSimulationStudio />
				</div>
			)}

                                                                        {/* TAB CONTENT 1: Load & Scale Simulator */}
                                                                        {activeTab === 'load' && (
                                                                                                <div className="space-y-6">
                                                                                                                        {simData && (
                                                                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                                                                        <h3 className="text-base font-black text-foreground border-b pb-2">
                                                                                                                                                                                                Simulation
                                                                                                                                                                                                Results:{' '}
                                                                                                                                                                                                {
                                                                                                                                                                                                                        simData.scenario
                                                                                                                                                                                                }
                                                                                                                                                                        </h3>
                                                                                                                                                                        <div className="grid gap-4 md:grid-cols-2 text-xs">
                                                                                                                                                                                                <div className="p-4 bg-muted/10 rounded-xl space-y-1 border">
                                                                                                                                                                                                                        <span className="font-extrabold text-foreground block">
                                                                                                                                                                                                                                                Predicted
                                                                                                                                                                                                                                                Bottlenecks
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                                                                                                                                                                                                                                                {simData.bottlenecks.map(
                                                                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                                                                b: string,
                                                                                                                                                                                                                                                                                                i: number
                                                                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                                                                <li
                                                                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                                                                i
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                b
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </li>
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                        </ul>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="p-4 bg-muted/10 rounded-xl space-y-1 border">
                                                                                                                                                                                                                        <span className="font-extrabold text-emerald-400 block">
                                                                                                                                                                                                                                                Recommended
                                                                                                                                                                                                                                                Architecture
                                                                                                                                                                                                                                                Fixes
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                                                                                                                                                                                                                                                {simData.recommendations.map(
                                                                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                                                                r: string,
                                                                                                                                                                                                                                                                                                i: number
                                                                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                                                                <li
                                                                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                                                                i
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                r
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </li>
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                        </ul>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        )}

                                                                                                                        <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                                                <div className="flex justify-between items-center border-b pb-3">
                                                                                                                                                                        <h3 className="text-base font-black text-foreground">
                                                                                                                                                                                                Scenario
                                                                                                                                                                                                Simulation
                                                                                                                                                                                                Suite
                                                                                                                                                                        </h3>
                                                                                                                                                                        <Link
                                                                                                                                                                                                href="/scenario-simulator"
                                                                                                                                                                                                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                                                                                                                                                        >
                                                                                                                                                                                                Open
                                                                                                                                                                                                Full
                                                                                                                                                                                                Scenario
                                                                                                                                                                                                Studio{' '}
                                                                                                                                                                                                <ExternalLink className="h-3.5 w-3.5" />
                                                                                                                                                                        </Link>
                                                                                                                                                </div>
                                                                                                                                                <p className="text-xs text-muted-foreground">
                                                                                                                                                                        Run
                                                                                                                                                                        traffic
                                                                                                                                                                        spikes,
                                                                                                                                                                        chaos
                                                                                                                                                                        experiments,
                                                                                                                                                                        microservices
                                                                                                                                                                        splits,
                                                                                                                                                                        and
                                                                                                                                                                        infrastructure
                                                                                                                                                                        failovers
                                                                                                                                                                        in
                                                                                                                                                                        a
                                                                                                                                                                        virtual
                                                                                                                                                                        environment.
                                                                                                                                                </p>
                                                                                                                                                <div className="grid gap-3 md:grid-cols-3 text-xs">
                                                                                                                                                                        <div className="p-4 bg-muted/10 rounded-xl border space-y-1">
                                                                                                                                                                                                <span className="font-extrabold text-foreground block">
                                                                                                                                                                                                                        100M
                                                                                                                                                                                                                        User
                                                                                                                                                                                                                        Traffic
                                                                                                                                                                                                                        Spike
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <p className="text-muted-foreground text-[11px]">
                                                                                                                                                                                                                        Simulate
                                                                                                                                                                                                                        100x
                                                                                                                                                                                                                        traffic
                                                                                                                                                                                                                        surge
                                                                                                                                                                                                                        on
                                                                                                                                                                                                                        REST
                                                                                                                                                                                                                        endpoints.
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="p-4 bg-muted/10 rounded-xl border space-y-1">
                                                                                                                                                                                                <span className="font-extrabold text-foreground block">
                                                                                                                                                                                                                        Database
                                                                                                                                                                                                                        Read
                                                                                                                                                                                                                        Sharding
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <p className="text-muted-foreground text-[11px]">
                                                                                                                                                                                                                        Simulate
                                                                                                                                                                                                                        splitting
                                                                                                                                                                                                                        monolithic
                                                                                                                                                                                                                        Postgres
                                                                                                                                                                                                                        to
                                                                                                                                                                                                                        read
                                                                                                                                                                                                                        replicas.
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="p-4 bg-muted/10 rounded-xl border space-y-1">
                                                                                                                                                                                                <span className="font-extrabold text-foreground block">
                                                                                                                                                                                                                        Auth
                                                                                                                                                                                                                        Gateway
                                                                                                                                                                                                                        Split
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <p className="text-muted-foreground text-[11px]">
                                                                                                                                                                                                                        Simulate
                                                                                                                                                                                                                        extracting
                                                                                                                                                                                                                        auth
                                                                                                                                                                                                                        into
                                                                                                                                                                                                                        dedicated
                                                                                                                                                                                                                        microservice.
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB CONTENT 2: Refactoring Impact Simulator */}
                                                                        {activeTab ===
                                                                                                'refactor' && (
                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                        <div className="flex justify-between items-center border-b pb-3">
                                                                                                                                                <h3 className="text-base font-black text-foreground">
                                                                                                                                                                        Refactoring
                                                                                                                                                                        Impact
                                                                                                                                                                        Simulator
                                                                                                                                                </h3>
                                                                                                                                                <Link
                                                                                                                                                                        href="/caee"
                                                                                                                                                                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                                                                                                                                >
                                                                                                                                                                        Open
                                                                                                                                                                        Refactoring
                                                                                                                                                                        Impact
                                                                                                                                                                        Studio{' '}
                                                                                                                                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                Predict
                                                                                                                                                how
                                                                                                                                                class
                                                                                                                                                refactoring,
                                                                                                                                                parameter
                                                                                                                                                changes,
                                                                                                                                                or
                                                                                                                                                interface
                                                                                                                                                modifications
                                                                                                                                                propagate
                                                                                                                                                across
                                                                                                                                                call
                                                                                                                                                trees
                                                                                                                                                before
                                                                                                                                                committing
                                                                                                                                                changes.
                                                                                                                        </p>
                                                                                                                        <div className="p-8 border rounded-xl bg-muted/10 text-center space-y-3">
                                                                                                                                                <Layers className="h-10 w-10 text-purple-400 mx-auto" />
                                                                                                                                                <h4 className="text-sm font-bold text-foreground">
                                                                                                                                                                        Breaking
                                                                                                                                                                        Change
                                                                                                                                                                        &
                                                                                                                                                                        Impact
                                                                                                                                                                        Matrix
                                                                                                                                                                        Ready
                                                                                                                                                </h4>
                                                                                                                                                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                                                                                                                                                                        View
                                                                                                                                                                        affected
                                                                                                                                                                        AST
                                                                                                                                                                        callers,
                                                                                                                                                                        test
                                                                                                                                                                        suite
                                                                                                                                                                        impact,
                                                                                                                                                                        and
                                                                                                                                                                        estimated
                                                                                                                                                                        refactoring
                                                                                                                                                                        effort.
                                                                                                                                                </p>
                                                                                                                                                <Link href="/caee">
                                                                                                                                                                        <Button
                                                                                                                                                                                                size="sm"
                                                                                                                                                                                                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs mt-2"
                                                                                                                                                                        >
                                                                                                                                                                                                Simulate
                                                                                                                                                                                                Refactoring
                                                                                                                                                                                                Impact
                                                                                                                                                                        </Button>
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB CONTENT 3: Schema & Database Evolution Simulator */}
                                                                        {activeTab === 'schema' && (
                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                        <div className="flex justify-between items-center border-b pb-3">
                                                                                                                                                <h3 className="text-base font-black text-foreground">
                                                                                                                                                                        Database
                                                                                                                                                                        Schema
                                                                                                                                                                        Evolution
                                                                                                                                                                        Simulator
                                                                                                                                                </h3>
                                                                                                                                                <Link
                                                                                                                                                                        href="/edie"
                                                                                                                                                                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                                                                                                                                >
                                                                                                                                                                        Open
                                                                                                                                                                        Schema
                                                                                                                                                                        Migration
                                                                                                                                                                        Studio{' '}
                                                                                                                                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                Simulate
                                                                                                                                                zero-downtime
                                                                                                                                                database
                                                                                                                                                schema
                                                                                                                                                migrations,
                                                                                                                                                column
                                                                                                                                                deprecations,
                                                                                                                                                and
                                                                                                                                                table
                                                                                                                                                splits
                                                                                                                                                across
                                                                                                                                                ORM
                                                                                                                                                models.
                                                                                                                        </p>
                                                                                                                        <div className="p-8 border rounded-xl bg-muted/10 text-center space-y-3">
                                                                                                                                                <Database className="h-10 w-10 text-emerald-400 mx-auto" />
                                                                                                                                                <h4 className="text-sm font-bold text-foreground">
                                                                                                                                                                        Schema
                                                                                                                                                                        Migration
                                                                                                                                                                        Blueprint
                                                                                                                                                                        Engine
                                                                                                                                                                        Ready
                                                                                                                                                </h4>
                                                                                                                                                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                                                                                                                                                                        Generate
                                                                                                                                                                        multi-step
                                                                                                                                                                        safe
                                                                                                                                                                        migration
                                                                                                                                                                        scripts,
                                                                                                                                                                        back-fill
                                                                                                                                                                        verifications,
                                                                                                                                                                        and
                                                                                                                                                                        lock
                                                                                                                                                                        time
                                                                                                                                                                        predictions.
                                                                                                                                                </p>
                                                                                                                                                <Link href="/edie">
                                                                                                                                                                        <Button
                                                                                                                                                                                                size="sm"
                                                                                                                                                                                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs mt-2"
                                                                                                                                                                        >
                                                                                                                                                                                                Simulate
                                                                                                                                                                                                Schema
                                                                                                                                                                                                Migration
                                                                                                                                                                        </Button>
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}
                                                </div>
                        );
}
