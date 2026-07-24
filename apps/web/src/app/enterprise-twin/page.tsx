'use client';

import * as React from 'react';
import { useAuth } from '@/context/auth-context';
import {
                        Server,
                        Loader2,
                        CheckCircle2,
                        Database,
                        Zap,
                        Cpu,
                        GitBranch,
                        Terminal,
                        ArrowRight,
                        Play,
                        Activity,
                        Shield,
                        Key,
                        DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Repository {
                        id: string;
                        name: string;
                        full_name: string;
}

interface K8sCluster {
                        name: string;
                        status: string;
                        pods_count: number;
                        version: string;
}

interface DockerContainer {
                        name: string;
                        image: string;
                        status: string;
                        port: string;
}

interface CicdPipeline {
                        name: string;
                        status: string;
                        last_run: string;
                        steps: string[];
}

interface CloudResource {
                        type: string;
                        name: string;
                        provider: string;
                        status: string;
}

interface MessageBroker {
                        type: string;
                        queue_name: string;
                        messages_count: number;
                        status: string;
}

interface ApiGateway {
                        name: string;
                        routes_count: number;
                        status: string;
}

interface MonitoringSystem {
                        type: string;
                        alert_rules_count: number;
                        status: string;
}

interface IaCConfig {
                        tool: string;
                        resources_managed: number;
                        status: string;
}

interface SaasIntegration {
                        provider: string;
                        service_type: string;
                        status: string;
}

interface EnterpriseInfrastructure {
                        repository_id: string;
                        k8s_cluster: K8sCluster;
                        containers: DockerContainer[];
                        pipeline: CicdPipeline;
                        cloud_resources: CloudResource[];
                        broker: MessageBroker;
                        gateway: ApiGateway;
                        monitoring: MonitoringSystem;
                        iac: IaCConfig;
                        saas: SaasIntegration[];
}

export default function EnterpriseTwinPage() {
                        const { token } = useAuth();
                        const [repos, setRepos] = React.useState<Repository[]>([]);
                        const [selectedRepoId, setSelectedRepoId] = React.useState<string>('');
                        const [infra, setInfra] = React.useState<EnterpriseInfrastructure | null>(
                                                null
                        );
                        const [loading, setLoading] = React.useState<boolean>(true);

                        // Terminal console states
                        const [logs, setLogs] = React.useState<string[]>([]);
                        const terminalEndRef = React.useRef<HTMLDivElement>(null);

                        // Load repositories
                        React.useEffect(() => {
                                                if (!token) return;
                                                fetch('/api/v1/repositories', {
                                                                        headers: {
                                                                                                Authorization: `Bearer ${token}`,
                                                                        },
                                                })
                                                                        .then((res) => res.json())
                                                                        .then((data) => {
                                                                                                setRepos(
                                                                                                                        data
                                                                                                );
                                                                                                if (
                                                                                                                        data.length >
                                                                                                                        0
                                                                                                ) {
                                                                                                                        setSelectedRepoId(
                                                                                                                                                data[0]
                                                                                                                                                                        .id
                                                                                                                        );
                                                                                                }
                                                                        })
                                                                        .catch((err) =>
                                                                                                console.error(
                                                                                                                        'Error loading repositories',
                                                                                                                        err
                                                                                                )
                                                                        );
                        }, [token]);

                        // Load enterprise infrastructure
                        const fetchInfrastructure = (repoId: string) => {
                                                if (!token || !repoId) return;
                                                setLoading(true);
                                                fetch(
                                                                        `/api/v1/digital-twin/${repoId}/enterprise-infrastructure`,
                                                                        {
                                                                                                headers: {
                                                                                                                        Authorization: `Bearer ${token}`,
                                                                                                },
                                                                        }
                                                )
                                                                        .then((res) => res.json())
                                                                        .then((data) => {
                                                                                                setInfra(
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
                        };

                        React.useEffect(() => {
                                                if (selectedRepoId) {
                                                                        fetchInfrastructure(
                                                                                                selectedRepoId
                                                                        );
                                                }
                        }, [selectedRepoId]);

                        // Mock terminal log messages updates
                        React.useEffect(() => {
                                                setLogs([
                                                                        `[${new Date().toLocaleTimeString()}] [SYSTEM] Connected to CodeAtlas relational twin agent.`,
                                                                        `[${new Date().toLocaleTimeString()}] [IAC] Evaluated Terraform modules footprint: 34 active definitions.`,
                                                                        `[${new Date().toLocaleTimeString()}] [CICD] Checked GitHub Actions pipelines status: SUCCESS (last run 2h ago).`,
                                                ]);

                                                const mockTemplates = [
                                                                        () =>
                                                                                                `[${new Date().toLocaleTimeString()}] [EKS] Health check passed for pod replica: pod-web-frontend-${Math.random().toString(36).substring(2, 6)} (200 OK)`,
                                                                        () =>
                                                                                                `[${new Date().toLocaleTimeString()}] [PROMETHEUS] Scraping target database metrics. CPU Load: ${Math.round(20 + Math.random() * 30)}% (Normal)`,
                                                                        () =>
                                                                                                `[${new Date().toLocaleTimeString()}] [RABBITMQ] Consumers load balanced. Pulled ${Math.round(1 + Math.random() * 5)} messages from queue 'async-task-queue'`,
                                                                        () =>
                                                                                                `[${new Date().toLocaleTimeString()}] [STRIPE] Webhook signature verified. Auth handshake success.`,
                                                                        () =>
                                                                                                `[${new Date().toLocaleTimeString()}] [KONG] API Gateway route processed. Handled request in ${Math.round(5 + Math.random() * 10)}ms (SLA optimal)`,
                                                                        () =>
                                                                                                `[${new Date().toLocaleTimeString()}] [AUTH0] User session single-sign-on handshake resolved.`,
                                                ];

                                                const interval = setInterval(() => {
                                                                        const randomTemplate =
                                                                                                mockTemplates[
                                                                                                                        Math.floor(
                                                                                                                                                Math.random() *
                                                                                                                                                                        mockTemplates.length
                                                                                                                        )
                                                                                                ];
                                                                        setLogs((prev) => {
                                                                                                const updated =
                                                                                                                        [
                                                                                                                                                ...prev,
                                                                                                                                                randomTemplate(),
                                                                                                                        ];
                                                                                                if (
                                                                                                                        updated.length >
                                                                                                                        25
                                                                                                )
                                                                                                                        updated.shift();
                                                                                                return updated;
                                                                        });
                                                }, 3200);

                                                return () => clearInterval(interval);
                        }, [selectedRepoId]);

                        // Auto scroll terminal to bottom
                        React.useEffect(() => {
                                                terminalEndRef.current?.scrollIntoView({
                                                                        behavior: 'smooth',
                                                });
                        }, [logs]);

                        return (
                                                <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col gap-6 font-mono">
                                                                        {/* Header selection panel */}
                                                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
                                                                                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent pointer-events-none" />
                                                                                                <div>
                                                                                                                        <h1 className="text-xl font-bold flex items-center gap-2">
                                                                                                                                                <Server className="h-6 w-6 text-indigo-400" />
                                                                                                                                                Enterprise
                                                                                                                                                Infrastructure
                                                                                                                                                Twin
                                                                                                                        </h1>
                                                                                                                        <p className="text-xs text-slate-400 mt-1">
                                                                                                                                                Visualize
                                                                                                                                                Kubernetes
                                                                                                                                                clusters,
                                                                                                                                                Docker
                                                                                                                                                container
                                                                                                                                                mappings,
                                                                                                                                                active
                                                                                                                                                CI/CD
                                                                                                                                                build
                                                                                                                                                states,
                                                                                                                                                and
                                                                                                                                                third-party
                                                                                                                                                SaaS
                                                                                                                                                connections.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                <div className="flex items-center gap-3">
                                                                                                                        <span className="text-xs text-slate-400 uppercase font-bold">
                                                                                                                                                Select
                                                                                                                                                Active
                                                                                                                                                Twin:
                                                                                                                        </span>
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
                                                                                                                                                className="bg-slate-950 border border-slate-800 text-xs rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-slate-200"
                                                                                                                        >
                                                                                                                                                {repos.map(
                                                                                                                                                                        (
                                                                                                                                                                                                r
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <option
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                r.id
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        value={
                                                                                                                                                                                                                                                r.id
                                                                                                                                                                                                                        }
                                                                                                                                                                                                >
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                r.name
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </option>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </select>
                                                                                                </div>
                                                                        </div>

                                                                        {loading ? (
                                                                                                <div className="flex flex-col items-center justify-center flex-1 min-h-[400px]">
                                                                                                                        <Loader2 className="h-10 w-10 text-indigo-400 animate-spin mb-4" />
                                                                                                                        <span className="text-xs text-slate-400 uppercase tracking-widest">
                                                                                                                                                Compiling
                                                                                                                                                infrastructure
                                                                                                                                                nodes...
                                                                                                                        </span>
                                                                                                </div>
                                                                        ) : infra ? (
                                                                                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                                                                                                                        {/* LEFT: Grid of modeled infrastructure system blocks */}
                                                                                                                        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                                                                                                {/* 1. Kubernetes Cluster (AWS EKS) */}
                                                                                                                                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-3">
                                                                                                                                                                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                                                                                                                                                                                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                                                                                                                                                                                        ☸️
                                                                                                                                                                                                                        Kubernetes
                                                                                                                                                                                                                        Cluster
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                infra
                                                                                                                                                                                                                                                                        .k8s_cluster
                                                                                                                                                                                                                                                                        .status
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="flex flex-col gap-2 text-[10px] text-slate-400">
                                                                                                                                                                                                <div className="flex justify-between">
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                Cluster
                                                                                                                                                                                                                                                Name:
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-slate-200 font-bold">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        infra
                                                                                                                                                                                                                                                                                                .k8s_cluster
                                                                                                                                                                                                                                                                                                .name
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="flex justify-between">
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                EKS
                                                                                                                                                                                                                                                Version:
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-slate-200 font-bold">
                                                                                                                                                                                                                                                v
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        infra
                                                                                                                                                                                                                                                                                                .k8s_cluster
                                                                                                                                                                                                                                                                                                .version
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="flex justify-between">
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                Running
                                                                                                                                                                                                                                                Pods:
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-cyan-400 font-bold">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        infra
                                                                                                                                                                                                                                                                                                .k8s_cluster
                                                                                                                                                                                                                                                                                                .pods_count
                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                active
                                                                                                                                                                                                                                                replicas
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* 2. Docker Containers Registry */}
                                                                                                                                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-3">
                                                                                                                                                                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                                                                                                                                                                                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                                                                                                                                                                                        🐳
                                                                                                                                                                                                                        Container
                                                                                                                                                                                                                        Registry
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">
                                                                                                                                                                                                                        ECR
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="flex flex-col gap-2.5 text-[10px] text-slate-400">
                                                                                                                                                                                                {infra.containers.map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                c,
                                                                                                                                                                                                                                                i
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                i
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className="flex justify-between items-center bg-slate-950/40 p-1.5 border border-slate-950 rounded"
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        <div className="flex flex-col">
                                                                                                                                                                                                                                                                                                <span className="text-slate-200 font-bold">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                c.name
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span className="text-[8px] text-slate-500">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                c.image
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <div className="flex flex-col items-end">
                                                                                                                                                                                                                                                                                                <span className="text-[8px] text-emerald-400 font-bold uppercase">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                c.status
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span className="text-[8px] text-slate-500">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                c.port
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* 3. CI/CD Deployment Flow */}
                                                                                                                                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-3">
                                                                                                                                                                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                                                                                                                                                                                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                                                                                                                                                                                        🚀
                                                                                                                                                                                                                        CI/CD
                                                                                                                                                                                                                        Pipeline
                                                                                                                                                                                                                        Actions
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                infra
                                                                                                                                                                                                                                                                        .pipeline
                                                                                                                                                                                                                                                                        .status
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="flex flex-col gap-3 mt-1">
                                                                                                                                                                                                <div className="flex items-center gap-2 font-mono text-[9px] text-slate-400">
                                                                                                                                                                                                                        {infra.pipeline.steps.map(
                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                        step,
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                                                                        <React.Fragment
                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                <div className="bg-slate-950 border border-slate-850 p-1.5 rounded flex items-center gap-1.5">
                                                                                                                                                                                                                                                                                                                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                                                                                                                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                        step.split(
                                                                                                                                                                                                                                                                                                                                                                                                ' '
                                                                                                                                                                                                                                                                                                                                                                        )[0]
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                {idx <
                                                                                                                                                                                                                                                                                                                        infra
                                                                                                                                                                                                                                                                                                                                                .pipeline
                                                                                                                                                                                                                                                                                                                                                .steps
                                                                                                                                                                                                                                                                                                                                                .length -
                                                                                                                                                                                                                                                                                                                                                1 && (
                                                                                                                                                                                                                                                                                                                        <ArrowRight className="h-3 w-3 text-slate-650" />
                                                                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                                                                        </React.Fragment>
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <span className="text-[8px] text-slate-500 uppercase font-bold text-right">
                                                                                                                                                                                                                        Flow:{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                infra
                                                                                                                                                                                                                                                                        .pipeline
                                                                                                                                                                                                                                                                        .name
                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                        •
                                                                                                                                                                                                                        Last
                                                                                                                                                                                                                        Run{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                infra
                                                                                                                                                                                                                                                                        .pipeline
                                                                                                                                                                                                                                                                        .last_run
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* 4. Cloud DB & Object Storage */}
                                                                                                                                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-3">
                                                                                                                                                                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                                                                                                                                                                                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                                                                                                                                                                                        ☁️
                                                                                                                                                                                                                        Cloud
                                                                                                                                                                                                                        Datastores
                                                                                                                                                                                                                        &
                                                                                                                                                                                                                        buckets
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">
                                                                                                                                                                                                                        AWS
                                                                                                                                                                                                                        RDS
                                                                                                                                                                                                                        /
                                                                                                                                                                                                                        S3
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="flex flex-col gap-2 text-[10px] text-slate-400">
                                                                                                                                                                                                {infra.cloud_resources.map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                res,
                                                                                                                                                                                                                                                i
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                i
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className="flex justify-between border-b border-slate-950 pb-1.5 last:border-0 last:pb-0"
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        <div className="flex flex-col">
                                                                                                                                                                                                                                                                                                <span className="text-slate-200 font-bold">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                res.name
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span className="text-[8px] text-slate-500">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                res.type
                                                                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                res.provider
                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <span className="text-[8px] text-emerald-400 font-bold uppercase self-center">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        res.status
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* 5. Message Brokers & Gateways */}
                                                                                                                                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-3">
                                                                                                                                                                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                                                                                                                                                                                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                                                                                                                                                                                        ✉️
                                                                                                                                                                                                                        Brokers
                                                                                                                                                                                                                        &
                                                                                                                                                                                                                        API
                                                                                                                                                                                                                        Gateways
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">
                                                                                                                                                                                                                        AMQP
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="flex flex-col gap-2 text-[10px] text-slate-400">
                                                                                                                                                                                                <div className="flex justify-between border-b border-slate-950 pb-1.5">
                                                                                                                                                                                                                        <div className="flex flex-col">
                                                                                                                                                                                                                                                <span className="text-slate-200 font-bold">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                infra
                                                                                                                                                                                                                                                                                                                        .broker
                                                                                                                                                                                                                                                                                                                        .type
                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                        broker
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-[8px] text-slate-500">
                                                                                                                                                                                                                                                                        Queue:{' '}
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                infra
                                                                                                                                                                                                                                                                                                                        .broker
                                                                                                                                                                                                                                                                                                                        .queue_name
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <span className="text-cyan-400 font-bold self-center">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        infra
                                                                                                                                                                                                                                                                                                .broker
                                                                                                                                                                                                                                                                                                .messages_count
                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                messages
                                                                                                                                                                                                                                                queue
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="flex justify-between">
                                                                                                                                                                                                                        <div className="flex flex-col">
                                                                                                                                                                                                                                                <span className="text-slate-200 font-bold">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                infra
                                                                                                                                                                                                                                                                                                                        .gateway
                                                                                                                                                                                                                                                                                                                        .name
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-[8px] text-slate-500">
                                                                                                                                                                                                                                                                        Active
                                                                                                                                                                                                                                                                        path
                                                                                                                                                                                                                                                                        routers
                                                                                                                                                                                                                                                                        list
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <span className="text-slate-200 font-bold self-center">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        infra
                                                                                                                                                                                                                                                                                                .gateway
                                                                                                                                                                                                                                                                                                .routes_count
                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                paths
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* 6. IaC & Monitoring Systems */}
                                                                                                                                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-3">
                                                                                                                                                                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                                                                                                                                                                                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                                                                                                                                                                                        📜
                                                                                                                                                                                                                        IaC
                                                                                                                                                                                                                        &
                                                                                                                                                                                                                        Monitor
                                                                                                                                                                                                                        Systems
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">
                                                                                                                                                                                                                        TERRAFORM
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="flex flex-col gap-2 text-[10px] text-slate-400">
                                                                                                                                                                                                <div className="flex justify-between border-b border-slate-950 pb-1.5">
                                                                                                                                                                                                                        <div className="flex flex-col">
                                                                                                                                                                                                                                                <span className="text-slate-200 font-bold">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                infra
                                                                                                                                                                                                                                                                                                                        .monitoring
                                                                                                                                                                                                                                                                                                                        .type
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-[8px] text-slate-500">
                                                                                                                                                                                                                                                                        Scraping
                                                                                                                                                                                                                                                                        metrics
                                                                                                                                                                                                                                                                        target
                                                                                                                                                                                                                                                                        rules
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <span className="text-slate-200 font-bold self-center">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        infra
                                                                                                                                                                                                                                                                                                .monitoring
                                                                                                                                                                                                                                                                                                .alert_rules_count
                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                rules
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="flex justify-between">
                                                                                                                                                                                                                        <div className="flex flex-col">
                                                                                                                                                                                                                                                <span className="text-slate-200 font-bold">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                infra
                                                                                                                                                                                                                                                                                                                        .iac
                                                                                                                                                                                                                                                                                                                        .tool
                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                        configuration
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-[8px] text-slate-500">
                                                                                                                                                                                                                                                                        IaC
                                                                                                                                                                                                                                                                        state
                                                                                                                                                                                                                                                                        deployment
                                                                                                                                                                                                                                                                        assets
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <span className="text-slate-200 font-bold self-center">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        infra
                                                                                                                                                                                                                                                                                                .iac
                                                                                                                                                                                                                                                                                                .resources_managed
                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                resources
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        {/* RIGHT: Terminal logs and SaaS integrations */}
                                                                                                                        <div className="lg:col-span-4 flex flex-col gap-6">
                                                                                                                                                {/* SaaS connections */}
                                                                                                                                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-3">
                                                                                                                                                                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-850 pb-2">
                                                                                                                                                                                                💳
                                                                                                                                                                                                SaaS
                                                                                                                                                                                                Integrations
                                                                                                                                                                        </h3>
                                                                                                                                                                        <div className="flex flex-col gap-2 text-[10px] text-slate-400">
                                                                                                                                                                                                {infra.saas.map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                item,
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className="flex justify-between items-center bg-slate-950/40 p-2 border border-slate-950 rounded"
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        <div className="flex flex-col">
                                                                                                                                                                                                                                                                                                <span className="text-slate-200 font-bold">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                item.provider
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span className="text-[8px] text-slate-500">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                item.service_type
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <span className="text-[8px] text-emerald-400 font-bold uppercase">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        item.status
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* Interactive trace console */}
                                                                                                                                                <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col shadow-xl overflow-hidden min-h-[300px]">
                                                                                                                                                                        {/* status bar */}
                                                                                                                                                                        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-850 flex justify-between items-center">
                                                                                                                                                                                                <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5">
                                                                                                                                                                                                                        <Terminal className="h-3.5 w-3.5 text-indigo-400" />{' '}
                                                                                                                                                                                                                        Operational
                                                                                                                                                                                                                        Console
                                                                                                                                                                                                                        Log
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <div className="flex items-center gap-1">
                                                                                                                                                                                                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                                                                                                                                                                                                                        <span className="text-[8px] text-slate-500">
                                                                                                                                                                                                                                                LIVE
                                                                                                                                                                                                                                                FEED
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        {/* Logs list */}
                                                                                                                                                                        <div className="bg-slate-950 p-4 font-mono text-[9px] text-slate-400 leading-normal flex-1 overflow-y-auto max-h-[320px] flex flex-col gap-1.5">
                                                                                                                                                                                                {logs.map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                log,
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        ) => {
                                                                                                                                                                                                                                                let color =
                                                                                                                                                                                                                                                                        'text-slate-450';
                                                                                                                                                                                                                                                if (
                                                                                                                                                                                                                                                                        log.includes(
                                                                                                                                                                                                                                                                                                'SUCCESS'
                                                                                                                                                                                                                                                                        ) ||
                                                                                                                                                                                                                                                                        log.includes(
                                                                                                                                                                                                                                                                                                'OK'
                                                                                                                                                                                                                                                                        ) ||
                                                                                                                                                                                                                                                                        log.includes(
                                                                                                                                                                                                                                                                                                'CONNECTED'
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        color =
                                                                                                                                                                                                                                                                                                'text-emerald-400';
                                                                                                                                                                                                                                                if (
                                                                                                                                                                                                                                                                        log.includes(
                                                                                                                                                                                                                                                                                                'IAC'
                                                                                                                                                                                                                                                                        ) ||
                                                                                                                                                                                                                                                                        log.includes(
                                                                                                                                                                                                                                                                                                'PROMETHEUS'
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        color =
                                                                                                                                                                                                                                                                                                'text-cyan-400';
                                                                                                                                                                                                                                                if (
                                                                                                                                                                                                                                                                        log.includes(
                                                                                                                                                                                                                                                                                                'Celery'
                                                                                                                                                                                                                                                                        ) ||
                                                                                                                                                                                                                                                                        log.includes(
                                                                                                                                                                                                                                                                                                'RABBITMQ'
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        color =
                                                                                                                                                                                                                                                                                                'text-indigo-400';

                                                                                                                                                                                                                                                return (
                                                                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                className={`${color} leading-relaxed break-all`}
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        log
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                        }
                                                                                                                                                                                                )}
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        ref={
                                                                                                                                                                                                                                                terminalEndRef
                                                                                                                                                                                                                        }
                                                                                                                                                                                                />
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        ) : (
                                                                                                <div className="flex flex-col items-center justify-center flex-1 min-h-[400px] border border-dashed border-slate-800 rounded-xl">
                                                                                                                        <span className="text-xs text-slate-500">
                                                                                                                                                Failed
                                                                                                                                                to
                                                                                                                                                load
                                                                                                                                                infrastructure.
                                                                                                                                                Check
                                                                                                                                                backend
                                                                                                                                                services.
                                                                                                                        </span>
                                                                                                </div>
                                                                        )}
                                                </div>
                        );
}
