'use client';

import React, { useEffect, useState } from 'react';
import {
                        CheckCircle2,
                        Loader2,
                        Cpu,
                        FileCode,
                        Network,
                        Sparkles,
                        Database,
                        Shield,
                        Activity,
} from 'lucide-react';

interface IndexingProgressProps {
                        onComplete?: () => void;
                        repoName?: string;
}

export function IndexingProgress({ onComplete, repoName = 'Spoon-Knife' }: IndexingProgressProps) {
                        const [currentStep, setCurrentStep] = useState<number>(0);
                        const [elapsedTime, setElapsedTime] = useState<number>(0);
                        const [filesCount, setFilesCount] = useState<number>(0);
                        const [apisCount, setApisCount] = useState<number>(0);
                        const [servicesCount, setServicesCount] = useState<number>(0);
                        const [depsCount, setDepsCount] = useState<number>(0);

                        const steps = [
                                                { label: 'Cloning repository', icon: Database },
                                                { label: 'Parsing files', icon: FileCode },
                                                { label: 'Building AST', icon: Cpu },
                                                {
                                                                        label: 'Discovering dependencies',
                                                                        icon: Network,
                                                },
                                                {
                                                                        label: 'Creating knowledge graph',
                                                                        icon: Activity,
                                                },
                                                { label: 'Running AI analysis', icon: Sparkles },
                                                {
                                                                        label: 'Calculating repository health',
                                                                        icon: Shield,
                                                },
                                                {
                                                                        label: 'Generating recommendations',
                                                                        icon: Sparkles,
                                                },
                        ];

                        useEffect(() => {
                                                const timer = setInterval(() => {
                                                                        setElapsedTime(
                                                                                                (
                                                                                                                        prev
                                                                                                ) =>
                                                                                                                        +(
                                                                                                                                                prev +
                                                                                                                                                0.1
                                                                                                                        ).toFixed(
                                                                                                                                                1
                                                                                                                        )
                                                                        );
                                                }, 100);

                                                return () => clearInterval(timer);
                        }, []);

                        useEffect(() => {
                                                const stepInterval = setInterval(() => {
                                                                        setCurrentStep((prev) => {
                                                                                                if (
                                                                                                                        prev <
                                                                                                                        steps.length -
                                                                                                                                                1
                                                                                                ) {
                                                                                                                        return (
                                                                                                                                                prev +
                                                                                                                                                1
                                                                                                                        );
                                                                                                } else {
                                                                                                                        clearInterval(
                                                                                                                                                stepInterval
                                                                                                                        );
                                                                                                                        if (
                                                                                                                                                onComplete
                                                                                                                        )
                                                                                                                                                setTimeout(
                                                                                                                                                                        onComplete,
                                                                                                                                                                        500
                                                                                                                                                );
                                                                                                                        return prev;
                                                                                                }
                                                                        });
                                                }, 600);

                                                return () => clearInterval(stepInterval);
                        }, []);

                        useEffect(() => {
                                                if (currentStep >= 1) setFilesCount(35);
                                                if (currentStep >= 3) setApisCount(12);
                                                if (currentStep >= 4) setServicesCount(4);
                                                if (currentStep >= 5) setDepsCount(128);
                        }, [currentStep]);

                        const progressPercentage = Math.round(
                                                ((currentStep + 1) / steps.length) * 100
                        );

                        return (
                                                <div className="border border-primary/20 rounded-2xl bg-card/95 backdrop-blur-md p-6 space-y-6 shadow-2xl max-w-2xl mx-auto">
                                                                        <div className="flex justify-between items-center border-b pb-4">
                                                                                                <div>
                                                                                                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary block">
                                                                                                                                                Continuous
                                                                                                                                                Repository
                                                                                                                                                Indexer
                                                                                                                        </span>
                                                                                                                        <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                                                                                                                                                Analyzing{' '}
                                                                                                                                                <span className="text-primary">
                                                                                                                                                                        {
                                                                                                                                                                                                repoName
                                                                                                                                                                        }
                                                                                                                                                </span>
                                                                                                                        </h3>
                                                                                                </div>
                                                                                                <div className="text-right">
                                                                                                                        <span className="text-xs font-black text-emerald-400">
                                                                                                                                                {
                                                                                                                                                                        progressPercentage
                                                                                                                                                }

                                                                                                                                                %
                                                                                                                                                COMPLETE
                                                                                                                        </span>
                                                                                                                        <p className="text-[11px] text-muted-foreground font-mono">
                                                                                                                                                Elapsed:{' '}
                                                                                                                                                {
                                                                                                                                                                        elapsedTime
                                                                                                                                                }

                                                                                                                                                s
                                                                                                                        </p>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Animated Progress Bar */}
                                                                        <div className="w-full bg-muted/40 h-2.5 rounded-full overflow-hidden border border-muted/50">
                                                                                                <div
                                                                                                                        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full transition-all duration-500 ease-out"
                                                                                                                        style={{
                                                                                                                                                width: `${progressPercentage}%`,
                                                                                                                        }}
                                                                                                />
                                                                        </div>

                                                                        {/* 8-Step Progress Tracker Grid */}
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                                                {steps.map(
                                                                                                                        (
                                                                                                                                                step,
                                                                                                                                                idx
                                                                                                                        ) => {
                                                                                                                                                const isDone =
                                                                                                                                                                        idx <
                                                                                                                                                                        currentStep;
                                                                                                                                                const isCurrent =
                                                                                                                                                                        idx ===
                                                                                                                                                                        currentStep;

                                                                                                                                                return (
                                                                                                                                                                        <div
                                                                                                                                                                                                key={
                                                                                                                                                                                                                        idx
                                                                                                                                                                                                }
                                                                                                                                                                                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                                                                                                                                                                                                        isDone
                                                                                                                                                                                                                                                ? 'bg-emerald-500/10 border-emerald-500/30 text-foreground'
                                                                                                                                                                                                                                                : isCurrent
                                                                                                                                                                                                                                                  ? 'bg-primary/10 border-primary/40 text-foreground shadow-sm animate-pulse'
                                                                                                                                                                                                                                                  : 'bg-muted/10 border-transparent text-muted-foreground/50'
                                                                                                                                                                                                }`}
                                                                                                                                                                        >
                                                                                                                                                                                                {isDone ? (
                                                                                                                                                                                                                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                                                                                                                                                                                                ) : isCurrent ? (
                                                                                                                                                                                                                        <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
                                                                                                                                                                                                ) : (
                                                                                                                                                                                                                        <step.icon className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                                                                                                                                                                                                )}
                                                                                                                                                                                                <span className="text-xs font-extrabold">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                step.label
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                );
                                                                                                                        }
                                                                                                )}
                                                                        </div>

                                                                        {/* Discovered Stats HUD */}
                                                                        <div className="grid grid-cols-4 gap-3 pt-2 border-t">
                                                                                                <div className="bg-muted/20 border rounded-xl p-2.5 text-center">
                                                                                                                        <span className="text-[10px] font-black text-muted-foreground uppercase block">
                                                                                                                                                Discovered
                                                                                                                                                Files
                                                                                                                        </span>
                                                                                                                        <span className="text-base font-black text-foreground">
                                                                                                                                                {
                                                                                                                                                                        filesCount
                                                                                                                                                }
                                                                                                                        </span>
                                                                                                </div>
                                                                                                <div className="bg-muted/20 border rounded-xl p-2.5 text-center">
                                                                                                                        <span className="text-[10px] font-black text-muted-foreground uppercase block">
                                                                                                                                                APIs
                                                                                                                                                Found
                                                                                                                        </span>
                                                                                                                        <span className="text-base font-black text-foreground">
                                                                                                                                                {
                                                                                                                                                                        apisCount
                                                                                                                                                }
                                                                                                                        </span>
                                                                                                </div>
                                                                                                <div className="bg-muted/20 border rounded-xl p-2.5 text-center">
                                                                                                                        <span className="text-[10px] font-black text-muted-foreground uppercase block">
                                                                                                                                                Services
                                                                                                                        </span>
                                                                                                                        <span className="text-base font-black text-foreground">
                                                                                                                                                {
                                                                                                                                                                        servicesCount
                                                                                                                                                }
                                                                                                                        </span>
                                                                                                </div>
                                                                                                <div className="bg-muted/20 border rounded-xl p-2.5 text-center">
                                                                                                                        <span className="text-[10px] font-black text-muted-foreground uppercase block">
                                                                                                                                                Dependencies
                                                                                                                        </span>
                                                                                                                        <span className="text-base font-black text-indigo-400">
                                                                                                                                                {
                                                                                                                                                                        depsCount
                                                                                                                                                }
                                                                                                                        </span>
                                                                                                </div>
                                                                        </div>
                                                </div>
                        );
}
