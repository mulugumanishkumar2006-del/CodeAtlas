'use client';

import React from 'react';
import { Settings, Shield, Network, Terminal, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SettingsWorkflowPage() {
                        return (
                                                <div className="min-h-screen bg-background text-foreground p-8 space-y-8 max-w-7xl mx-auto">
                                                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                                                                                                <div className="space-y-1">
                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                <h1 className="text-3xl font-black tracking-tight text-foreground">
                                                                                                                                                                        ⚙️
                                                                                                                                                                        Settings
                                                                                                                                                                        Workflow
                                                                                                                                                </h1>
                                                                                                                                                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-black rounded-full uppercase tracking-wider">
                                                                                                                                                                        ENTERPRISE
                                                                                                                                                                        CONFIGURATION
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <p className="text-sm text-muted-foreground">
                                                                                                                                                Integrations
                                                                                                                                                Hub
                                                                                                                                                (GitHub,
                                                                                                                                                GitLab,
                                                                                                                                                Jira,
                                                                                                                                                Slack,
                                                                                                                                                Teams,
                                                                                                                                                Linear),
                                                                                                                                                CLI
                                                                                                                                                binaries,
                                                                                                                                                and
                                                                                                                                                Webhook
                                                                                                                                                subscriptions.
                                                                                                                        </p>
                                                                                                </div>
                                                                        </div>

                                                                        <div className="grid gap-6 md:grid-cols-2">
                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                        <h3 className="text-base font-black text-foreground border-b pb-2">
                                                                                                                                                Active
                                                                                                                                                Integrations
                                                                                                                        </h3>
                                                                                                                        <div className="space-y-3 text-xs">
                                                                                                                                                <div className="flex justify-between items-center p-3 bg-muted/10 rounded-xl">
                                                                                                                                                                        <span className="font-bold text-foreground">
                                                                                                                                                                                                GitHub
                                                                                                                                                                                                App
                                                                                                                                                                                                (CodeAtlas
                                                                                                                                                                                                Bot)
                                                                                                                                                                        </span>
                                                                                                                                                                        <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                                                                                                                                                                                                <CheckCircle2 className="h-3.5 w-3.5" />{' '}
                                                                                                                                                                                                Connected
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <div className="flex justify-between items-center p-3 bg-muted/10 rounded-xl">
                                                                                                                                                                        <span className="font-bold text-foreground">
                                                                                                                                                                                                Jira
                                                                                                                                                                                                Ticket
                                                                                                                                                                                                Generator
                                                                                                                                                                        </span>
                                                                                                                                                                        <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                                                                                                                                                                                                <CheckCircle2 className="h-3.5 w-3.5" />{' '}
                                                                                                                                                                                                Connected
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <div className="flex justify-between items-center p-3 bg-muted/10 rounded-xl">
                                                                                                                                                                        <span className="font-bold text-foreground">
                                                                                                                                                                                                Slack
                                                                                                                                                                                                Alert
                                                                                                                                                                                                Webhook
                                                                                                                                                                                                (#engineering-asip-alerts)
                                                                                                                                                                        </span>
                                                                                                                                                                        <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                                                                                                                                                                                                <CheckCircle2 className="h-3.5 w-3.5" />{' '}
                                                                                                                                                                                                Active
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
                                                                                                                        <h3 className="text-base font-black text-foreground border-b pb-2">
                                                                                                                                                CLI
                                                                                                                                                &
                                                                                                                                                Developer
                                                                                                                                                Tooling
                                                                                                                        </h3>
                                                                                                                        <div className="space-y-2 text-xs">
                                                                                                                                                <p className="text-muted-foreground">
                                                                                                                                                                        Executable:{' '}
                                                                                                                                                                        <strong className="text-foreground">
                                                                                                                                                                                                codeatlas-cli
                                                                                                                                                                                                v3.2.0
                                                                                                                                                                        </strong>
                                                                                                                                                </p>
                                                                                                                                                <p className="text-muted-foreground">
                                                                                                                                                                        GraphQL
                                                                                                                                                                        Endpoint:{' '}
                                                                                                                                                                        <strong className="text-foreground">
                                                                                                                                                                                                /api/v1/graphql
                                                                                                                                                                        </strong>
                                                                                                                                                </p>
                                                                                                                                                <p className="text-muted-foreground">
                                                                                                                                                                        Plugin
                                                                                                                                                                        SDK
                                                                                                                                                                        Version:{' '}
                                                                                                                                                                        <strong className="text-foreground">
                                                                                                                                                                                                v2.4.0
                                                                                                                                                                                                (Python,
                                                                                                                                                                                                TS,
                                                                                                                                                                                                Rust
                                                                                                                                                                                                PyO3)
                                                                                                                                                                        </strong>
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>
                                                </div>
                        );
}
