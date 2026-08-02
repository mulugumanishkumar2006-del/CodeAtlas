'use client';

import React from 'react';
import Link from 'next/link';

export default function EngineeringMissionControlPage() {
                        const [repositories, setRepositories] = React.useState<any[]>([]);
                        const [selectedRepoId, setSelectedRepoId] = React.useState<string>('');
                        const [token, setToken] = React.useState<string>('');
                        const [mcData, setMcData] = React.useState<any>(null);
                        const [loading, setLoading] = React.useState<boolean>(true);

                        React.useEffect(() => {
                                                const storedToken = localStorage.getItem('token');
                                                if (storedToken) setToken(storedToken);
                        }, []);

                        React.useEffect(() => {
                                                if (!token) return;
                                                fetch('/api/v1/repositories', {
                                                                        headers: {
                                                                                                Authorization: `Bearer ${token}`,
                                                                        },
                                                })
                                                                        .then((res) => res.json())
                                                                        .then((data) => {
                                                                                                const repos =
                                                                                                                        Array.isArray(
                                                                                                                                                data
                                                                                                                        )
                                                                                                                                                ? data
                                                                                                                                                : data.items ||
                                                                                                                                                  [];
                                                                                                setRepositories(
                                                                                                                        repos
                                                                                                );
                                                                                                if (
                                                                                                                        repos.length >
                                                                                                                                                0 &&
                                                                                                                        !selectedRepoId
                                                                                                ) {
                                                                                                                        setSelectedRepoId(
                                                                                                                                                repos[0]
                                                                                                                                                                        .id
                                                                                                                        );
                                                                                                }
                                                                        })
                                                                        .catch(console.error);
                        }, [token]);

                        React.useEffect(() => {
                                                if (!selectedRepoId || !token) return;
                                                setLoading(true);
                                                fetch(
                                                                        `/api/v1/repositories/${selectedRepoId}/asip/mission-control`,
                                                                        {
                                                                                                headers: {
                                                                                                                        Authorization: `Bearer ${token}`,
                                                                                                },
                                                                        }
                                                )
                                                                        .then((res) => res.json())
                                                                        .then((data) => {
                                                                                                setMcData(
                                                                                                                        data
                                                                                                );
                                                                                                setLoading(
                                                                                                                        false
                                                                                                );
                                                                        })
                                                                        .catch((err) => {
                                                                                                console.error(
                                                                                                                        err
                                                                                                );
                                                                                                setLoading(
                                                                                                                        false
                                                                                                );
                                                                        });
                        }, [selectedRepoId, token]);

                        return (
                                                <div className="min-h-screen bg-background text-foreground p-8 space-y-8 max-w-7xl mx-auto">
                                                                        {/* Page Header */}
                                                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                                                                                                <div className="space-y-1">
                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                <h1 className="text-3xl font-black tracking-tight text-foreground">
                                                                                                                                                                        🌐
                                                                                                                                                                        Engineering
                                                                                                                                                                        Mission
                                                                                                                                                                        Control
                                                                                                                                                </h1>
                                                                                                                                                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-black rounded-full uppercase tracking-wider">
                                                                                                                                                                        SIGNATURE
                                                                                                                                                                        FEATURE
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <p className="text-sm text-muted-foreground">
                                                                                                                                                The
                                                                                                                                                central
                                                                                                                                                intelligence
                                                                                                                                                layer
                                                                                                                                                connecting
                                                                                                                                                all
                                                                                                                                                11
                                                                                                                                                dimensions
                                                                                                                                                of
                                                                                                                                                software
                                                                                                                                                engineering
                                                                                                                                                in
                                                                                                                                                a
                                                                                                                                                single
                                                                                                                                                unified
                                                                                                                                                cascading
                                                                                                                                                view.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                <div className="flex items-center gap-4">
                                                                                                                        <Link
                                                                                                                                                href="/asip"
                                                                                                                                                className="px-4 py-2 text-xs font-extrabold border rounded-xl hover:bg-muted/50 transition-all flex items-center gap-2"
                                                                                                                        >
                                                                                                                                                🧠
                                                                                                                                                ASIP
                                                                                                                                                Console
                                                                                                                        </Link>
                                                                                                                        <select
                                                                                                                                                value={
                                                                                                                                                                        selectedRepoId
                                                                                                                                                }
                                                                                                                                                onChange={(
                                                                                                                                                                        e
                                                                                                                                                ) =>
                                                                                                                                                                        setSelectedRepoId(
                                                                                                                                                                                                e
                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                        .value
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className="px-4 py-2 bg-card border rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary outline-none shadow-sm"
                                                                                                                        >
                                                                                                                                                {repositories.map(
                                                                                                                                                                        (
                                                                                                                                                                                                repo
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <option
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                repo.id
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        value={
                                                                                                                                                                                                                                                repo.id
                                                                                                                                                                                                                        }
                                                                                                                                                                                                >
                                                                                                                                                                                                                        📁{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                repo.name
                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                repo.id
                                                                                                                                                                                                                        }

                                                                                                                                                                                                                        )
                                                                                                                                                                                                </option>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </select>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Global Mission Control Header Banner */}
                                                                        <div className="border border-indigo-500/30 rounded-2xl bg-gradient-to-r from-card via-card to-indigo-500/10 p-6 space-y-3 shadow-lg">
                                                                                                <div className="flex justify-between items-center">
                                                                                                                        <div>
                                                                                                                                                <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest block">
                                                                                                                                                                        System
                                                                                                                                                                        Intelligence
                                                                                                                                                                        Status
                                                                                                                                                </span>
                                                                                                                                                <h2 className="text-2xl font-black text-foreground">
                                                                                                                                                                        {mcData?.mission_control_status ||
                                                                                                                                                                                                'LOADING MISSION CONTROL...'}
                                                                                                                                                </h2>
                                                                                                                        </div>
                                                                                                                        <div className="text-right">
                                                                                                                                                <span className="text-xs font-bold text-muted-foreground uppercase block">
                                                                                                                                                                        Holistic
                                                                                                                                                                        Health
                                                                                                                                                </span>
                                                                                                                                                <h3 className="text-3xl font-black text-emerald-400">
                                                                                                                                                                        {mcData?.overall_health_score ||
                                                                                                                                                                                                92.0}
                                                                                                                                                                        /100
                                                                                                                                                </h3>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Cascading 11-Stage Pipeline */}
                                                                        <div className="space-y-4 relative">
                                                                                                {(
                                                                                                                        mcData?.cascading_pipeline ||
                                                                                                                        []
                                                                                                ).map(
                                                                                                                        (
                                                                                                                                                stage: any,
                                                                                                                                                index: number
                                                                                                                        ) => (
                                                                                                                                                <div
                                                                                                                                                                        key={
                                                                                                                                                                                                stage.stage_id
                                                                                                                                                                        }
                                                                                                                                                                        className="relative group"
                                                                                                                                                >
                                                                                                                                                                        {/* Cascading Flow Arrow Indicator */}
                                                                                                                                                                        {index >
                                                                                                                                                                                                0 && (
                                                                                                                                                                                                <div className="flex justify-center -my-2.5 relative z-10">
                                                                                                                                                                                                                        <div className="bg-indigo-500/20 text-indigo-400 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-indigo-500/30 shadow">
                                                                                                                                                                                                                                                ↓
                                                                                                                                                                                                                                                CASCADING
                                                                                                                                                                                                                                                INTELLIGENCE
                                                                                                                                                                                                                                                PIPELINE
                                                                                                                                                                                                                                                ↓
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )}

                                                                                                                                                                        <div className="border rounded-2xl bg-card p-6 shadow-sm hover:border-indigo-500/40 transition-all space-y-4">
                                                                                                                                                                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b pb-3">
                                                                                                                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                                                                                                                <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-black border border-indigo-500/30">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                stage.stage_order
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        <h3 className="text-lg font-black text-foreground">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        stage.title
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </h3>
                                                                                                                                                                                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        stage.subtitle
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <span className="px-3 py-1 bg-muted/40 text-foreground text-xs font-extrabold rounded-full border">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        stage.status_badge
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                stage.summary
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </p>

                                                                                                                                                                                                {/* Stage Metric Chips */}
                                                                                                                                                                                                <div className="flex flex-wrap gap-3 pt-1">
                                                                                                                                                                                                                        {Object.entries(
                                                                                                                                                                                                                                                stage.metrics ||
                                                                                                                                                                                                                                                                        {}
                                                                                                                                                                                                                        ).map(
                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                        [
                                                                                                                                                                                                                                                                                                key,
                                                                                                                                                                                                                                                                                                val,
                                                                                                                                                                                                                                                                        ]: any,
                                                                                                                                                                                                                                                                        i: number
                                                                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                        i
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                className="px-3 py-1.5 bg-muted/20 border rounded-xl text-xs flex items-center gap-2"
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                                                                                                                                                                                                                                                                                                        {key.replace(
                                                                                                                                                                                                                                                                                                                                                /_/g,
                                                                                                                                                                                                                                                                                                                                                ' '
                                                                                                                                                                                                                                                                                                                        )}

                                                                                                                                                                                                                                                                                                                        :
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span className="font-extrabold text-foreground">
                                                                                                                                                                                                                                                                                                                        {val.toString()}
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        )
                                                                                                )}
                                                                        </div>
                                                </div>
                        );
}
