'use client';

import React, { useState } from 'react';
import {
                        Activity,
                        Server,
                        Cpu,
                        Layers,
                        ShieldCheck,
                        AlertTriangle,
                        Play,
                        Zap,
                        Terminal,
                        Clock,
                        Database,
                        GitBranch,
                        RefreshCw,
                        BarChart2,
                        FileText,
                        CheckCircle2,
                        ArrowRight,
                        TrendingUp,
                        Sliders,
                        HardDrive,
                        Wifi,
                        Network,
                        Share2,
                        Radio,
                        Boxes,
                        Search,
                        Bot,
                        History,
                        GitCommit,
                        Flame,
                        Check,
                        HelpCircle,
} from 'lucide-react';

export default function EngineeringRealityPage() {
                        const [simulating, setSimulating] = useState(false);
                        const [simResult, setSimResult] = useState<any>(null);
                        const [selectedStatusFilter, setSelectedStatusFilter] =
                                                useState<string>('ALL');
                        const [aiCommandInput, setAiCommandInput] = useState(
                                                'Triage payment timeout incident and propose fix'
                        );
                        const [aiResponse, setAiResponse] = useState<any>(null);
                        const [aiLoading, setAiLoading] = useState(false);

                        const realityHealth = {
                                                score: 93.5,
                                                status: 'SYNCHRONIZED_WITH_PRODUCTION',
                                                collectors: [
                                                                        {
                                                                                                name: 'GitHub Enterprise',
                                                                                                status: 'CONNECTED',
                                                                                                items: '14 Open PRs, 42 Commits 24h',
                                                                        },
                                                                        {
                                                                                                name: 'Kubernetes Cluster',
                                                                                                status: 'CONNECTED',
                                                                                                items: '12 Nodes, 84 Running Pods',
                                                                        },
                                                                        {
                                                                                                name: 'Datadog APM & Prometheus',
                                                                                                status: 'CONNECTED',
                                                                                                items: 'p95 Latency 42ms, 18.5K RPM',
                                                                        },
                                                                        {
                                                                                                name: 'Elasticsearch Logs',
                                                                                                status: 'CONNECTED',
                                                                                                items: '4.25M Logs Processed 24h',
                                                                        },
                                                                        {
                                                                                                name: 'ArgoCD & Jenkins Pipelines',
                                                                                                status: 'CONNECTED',
                                                                                                items: '0 Rollbacks (30 Days)',
                                                                        },
                                                ],
                        };

                        const runtimeNodes = [
                                                {
                                                                        id: 'node-1',
                                                                        name: 'auth-vault-pod-1',
                                                                        type: 'Kubernetes Pod',
                                                                        status: 'RUNNING',
                                                                        cpu: '24.5%',
                                                                        memory: '42.0%',
                                                                        disk: '31.2%',
                                                                        network: '145 Mbps',
                                                                        storage: '12.4 GB / 50 GB',
                                                                        restarts: 0,
                                                },
                                                {
                                                                        id: 'node-2',
                                                                        name: 'checkout-api-pod-1',
                                                                        type: 'Kubernetes Pod',
                                                                        status: 'SCALING',
                                                                        cpu: '78.0%',
                                                                        memory: '64.2%',
                                                                        disk: '45.1%',
                                                                        network: '420 Mbps',
                                                                        storage: '28.1 GB / 100 GB',
                                                                        restarts: 1,
                                                },
                                                {
                                                                        id: 'node-3',
                                                                        name: 'postgres-primary-db',
                                                                        type: 'Database',
                                                                        status: 'RUNNING',
                                                                        cpu: '62.0%',
                                                                        memory: '78.4%',
                                                                        disk: '68.9%',
                                                                        network: '890 Mbps',
                                                                        storage: '412.0 GB / 1 TB',
                                                                        restarts: 0,
                                                },
                                                {
                                                                        id: 'node-4',
                                                                        name: 'redis-l2-cache-cluster',
                                                                        type: 'Cache',
                                                                        status: 'RECOVERING',
                                                                        cpu: '18.4%',
                                                                        memory: '88.1%',
                                                                        disk: '12.0%',
                                                                        network: '310 Mbps',
                                                                        storage: '8.2 GB / 32 GB',
                                                                        restarts: 2,
                                                },
                                                {
                                                                        id: 'node-5',
                                                                        name: 'legacy-payment-gateway',
                                                                        type: 'Service',
                                                                        status: 'DEGRADED',
                                                                        cpu: '91.2%',
                                                                        memory: '82.5%',
                                                                        disk: '74.3%',
                                                                        network: '620 Mbps',
                                                                        storage: '45.0 GB / 80 GB',
                                                                        restarts: 4,
                                                },
                                                {
                                                                        id: 'node-6',
                                                                        name: 'analytics-ingestion-worker',
                                                                        type: 'Worker',
                                                                        status: 'FAILED',
                                                                        cpu: '0.0%',
                                                                        memory: '98.9%',
                                                                        disk: '89.4%',
                                                                        network: '0 Mbps',
                                                                        storage: '98.0 GB / 100 GB',
                                                                        restarts: 8,
                                                },
                        ];

                        const topologyEntities = [
                                                {
                                                                        name: 'Services',
                                                                        count: 14,
                                                                        status: '1 DEGRADED',
                                                },
                                                {
                                                                        name: 'Databases',
                                                                        count: 3,
                                                                        status: 'ALL RUNNING',
                                                },
                                                { name: 'Queues', count: 4, status: 'ALL RUNNING' },
                                                { name: 'APIs', count: 28, status: 'ALL RUNNING' },
                                                {
                                                                        name: 'Load Balancers',
                                                                        count: 2,
                                                                        status: 'ALL RUNNING',
                                                },
                                                {
                                                                        name: 'Kubernetes Pods',
                                                                        count: 84,
                                                                        status: '1 SCALING, 1 RECOVERING',
                                                },
                        ];

                        const infraHealthMetrics = [
                                                {
                                                                        metric: 'CPU Utilization',
                                                                        value: '54.0%',
                                                                        detail: '12 Cluster Nodes',
                                                                        status: 'HEALTHY',
                                                },
                                                {
                                                                        metric: 'Memory Usage',
                                                                        value: '75.7%',
                                                                        detail: '64.2 GB / 85 GB',
                                                                        status: 'NORMAL',
                                                },
                                                {
                                                                        metric: 'Disk IOPS',
                                                                        value: '53.3%',
                                                                        detail: '14.2K IOPS Peak',
                                                                        status: 'HEALTHY',
                                                },
                                                {
                                                                        metric: 'Network Bandwidth',
                                                                        value: '2.38 Gbps',
                                                                        detail: 'Ingress / Egress',
                                                                        status: 'OPTIMAL',
                                                },
                                                {
                                                                        metric: 'Storage Allocation',
                                                                        value: '603.7 GB',
                                                                        detail: 'Primary Persistent Volume',
                                                                        status: 'HEALTHY',
                                                },
                        ];

                        const databaseActivity = {
                                                qps: 4200,
                                                connections: '196 / 250 (78.4%)',
                                                replication: 'SYNCHRONIZED (Lag: 4ms)',
                                                slowQueries: [
                                                                        {
                                                                                                query: "SELECT * FROM legacy_transactions WHERE created_at > NOW() - INTERVAL '1 hour';",
                                                                                                duration: '1840 ms',
                                                                                                calls: '14/min',
                                                                                                rec: 'Missing Index on created_at column',
                                                                        },
                                                                        {
                                                                                                query: 'SELECT u.*, o.* FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.id;',
                                                                                                duration: '940 ms',
                                                                                                calls: '28/min',
                                                                                                rec: 'Add composite index on (user_id, status)',
                                                                        },
                                                ],
                        };

                        const deploymentTimeline = [
                                                {
                                                                        id: 'dep-101',
                                                                        time: '14 mins ago',
                                                                        version: 'v2.4.1',
                                                                        service: 'legacy-payment-gateway',
                                                                        commit: '8f3b2a1',
                                                                        author: 'Alex Dev',
                                                                        impact: 'DEGRADED (-8.4%)',
                                                                        status: 'COMPLETED',
                                                },
                                                {
                                                                        id: 'dep-100',
                                                                        time: '2 hours ago',
                                                                        version: 'v3.1.0',
                                                                        service: 'checkout-service',
                                                                        commit: '3c9d1e4',
                                                                        author: 'Sarah Eng',
                                                                        impact: 'OPTIMAL (+1.2%)',
                                                                        status: 'COMPLETED',
                                                },
                                                {
                                                                        id: 'dep-099',
                                                                        time: '6 hours ago',
                                                                        version: 'v1.8.4',
                                                                        service: 'auth-vault',
                                                                        commit: '1a4b8c2',
                                                                        author: 'Mike Sec',
                                                                        impact: 'OPTIMAL (+0.0%)',
                                                                        status: 'COMPLETED',
                                                },
                        ];

                        const incidentTimeline = [
                                                {
                                                                        id: 'inc-402',
                                                                        status: 'ACTIVE',
                                                                        severity: 'HIGH',
                                                                        target: 'legacy-payment-gateway',
                                                                        title: 'p95 Latency Spike to 1800ms',
                                                                        started: '12 mins ago',
                                                                        cause: 'DB Connection Pool Exhaustion due to missing index',
                                                },
                                                {
                                                                        id: 'inc-401',
                                                                        status: 'RESOLVED',
                                                                        severity: 'MEDIUM',
                                                                        target: 'redis-l2-cache-cluster',
                                                                        title: 'Cache Node Memory Pressure (88%)',
                                                                        started: '4 hours ago',
                                                                        cause: 'Unbounded key TTL in analytics queue',
                                                },
                        ];

                        const rootCauseAnalysis = {
                                                incident_id: 'inc-402',
                                                confidence: '94.8%',
                                                primary_cause: 'Unindexed SQL query execution on legacy_transactions table leading to Postgres DB Connection Pool Exhaustion.',
                                                triggering_event: 'Deployment v2.4.1 introduced unindexed WHERE created_at filter.',
                                                dependency_chain: 'AWS ALB Ingress ➔ API Gateway ➔ Checkout API ➔ Legacy Payment Gateway ➔ Postgres Primary DB',
                                                affected_services: [
                                                                        {
                                                                                                service: 'legacy-payment-gateway',
                                                                                                impact: 'CRITICAL BOTTLENECK (1800ms p95)',
                                                                        },
                                                                        {
                                                                                                service: 'checkout-service',
                                                                                                impact: 'DEGRADED (420ms p95)',
                                                                        },
                                                                        {
                                                                                                service: 'orders-router',
                                                                                                impact: 'DEGRADED (190ms p95)',
                                                                        },
                                                ],
                                                recovery_steps: [
                                                                        '1. Execute database index migration: CREATE INDEX CONCURRENTLY idx_transactions_created_at ON legacy_transactions(created_at);',
                                                                        '2. Dynamically expand Postgres Connection Pool limit from 100 to 250 connections.',
                                                                        '3. Enable circuit breaker fallbacks on Checkout API for legacy-payment-gateway timeouts.',
                                                ],
                        };

                        const capacityForecasts = [
                                                {
                                                                        metric: 'CPU Core Allocation',
                                                                        current: '48 Cores (54% utilized)',
                                                                        forecast_30d: '56 Cores (63%)',
                                                                        forecast_60d: '68 Cores (76%)',
                                                                        forecast_90d: '84 Cores (94% - ALERT)',
                                                                        rec: 'Schedule node expansion from 12 to 16 nodes in Day 45',
                                                },
                                                {
                                                                        metric: 'RAM Memory Capacity',
                                                                        current: '85 GB (75.7% utilized)',
                                                                        forecast_30d: '98 GB (86%)',
                                                                        forecast_60d: '112 GB (98% - EXHAUSTION)',
                                                                        forecast_90d: '130 GB (114% overloaded)',
                                                                        rec: 'Upgrade node instance types from m5.xlarge to m5.2xlarge in Day 40',
                                                },
                                                {
                                                                        metric: 'Postgres Storage',
                                                                        current: '412 GB / 1 TB (41.2%)',
                                                                        forecast_30d: '480 GB',
                                                                        forecast_60d: '560 GB',
                                                                        forecast_90d: '650 GB',
                                                                        rec: 'Storage volume remains healthy. Auto-expand trigger at 800 GB',
                                                },
                        ];

                        const liveCostBreakdown = {
                                                total: '$4,820.00 / mo',
                                                components: [
                                                                        {
                                                                                                name: 'Kubernetes EKS Compute (12 Nodes)',
                                                                                                cost: '$2,450.00',
                                                                                                pct: '50.8%',
                                                                        },
                                                                        {
                                                                                                name: 'Postgres RDS Primary + Replica',
                                                                                                cost: '$1,280.00',
                                                                                                pct: '26.5%',
                                                                        },
                                                                        {
                                                                                                name: 'Redis ElastiCache Cluster',
                                                                                                cost: '$420.00',
                                                                                                pct: '8.7%',
                                                                        },
                                                                        {
                                                                                                name: 'AWS ALB & Egress Network Traffic',
                                                                                                cost: '$670.00',
                                                                                                pct: '14.0%',
                                                                        },
                                                ],
                                                savingsTip: 'Save $640/mo by converting 4 idle worker nodes to AWS Spot Instances.',
                        };

                        const carbonFootprint = {
                                                monthly_co2e: '842.5 kg CO2e',
                                                annual_tons: '10.11 Metric Tons',
                                                pue: '1.15',
                                                green_pct: '74.2%',
                                                region: 'aws-us-east-1 (N. Virginia)',
                                                rating: 'GRADE A- (Low Carbon Density)',
                                                reductionTip: 'Migrate batch processing workloads to us-west-2 (Hydro-powered) to reduce CO2e by 28%.',
                        };

                        const anomaliesList = [
                                                {
                                                                        category: 'Latency',
                                                                        metric: 'p95 Latency Spike',
                                                                        service: 'legacy-payment-gateway',
                                                                        baseline: '45ms',
                                                                        current: '1800ms',
                                                                        severity: 'CRITICAL',
                                                                        cause: 'Postgres DB Connection Pool Exhaustion',
                                                },
                                                {
                                                                        category: 'Errors',
                                                                        metric: 'HTTP 5xx Error Rate Surge',
                                                                        service: 'legacy-payment-gateway',
                                                                        baseline: '0.01%',
                                                                        current: '14.2%',
                                                                        severity: 'CRITICAL',
                                                                        cause: 'Upstream timeout throwing unhandled ConnectionTimeoutException',
                                                },
                                                {
                                                                        category: 'Resource Usage',
                                                                        metric: 'Memory Pressure Anomaly',
                                                                        service: 'redis-l2-cache-cluster',
                                                                        baseline: '42%',
                                                                        current: '88.1%',
                                                                        severity: 'WARNING',
                                                                        cause: 'Unbounded key TTL accumulation in session store',
                                                },
                                                {
                                                                        category: 'Deployment Frequency',
                                                                        metric: 'Deploy Frequency Spike',
                                                                        service: 'checkout-service',
                                                                        baseline: '2/day',
                                                                        current: '8/day',
                                                                        severity: 'INFO',
                                                                        cause: 'Frequent hotfix deployments post v3.1.0 release',
                                                },
                        ];

                        const outagePredictions = [
                                                {
                                                                        service: 'legacy-payment-gateway',
                                                                        risk_pct: '78.4%',
                                                                        level: 'HIGH_RISK',
                                                                        factors: [
                                                                                                'High Tech Debt (Cyclomatic > 24)',
                                                                                                'Low Test Coverage (42%)',
                                                                                                '3 Unpatched CVEs',
                                                                                                'DB Pool Pressure (78.4%)',
                                                                        ],
                                                },
                                                {
                                                                        service: 'analytics-ingestion-worker',
                                                                        risk_pct: '45.2%',
                                                                        level: 'MODERATE_RISK',
                                                                        factors: [
                                                                                                'Memory Leak in Event Ingestion Queue',
                                                                                                '8 K8s Pod OOMKilled Restarts',
                                                                        ],
                                                },
                        ];

                        const engineeringEvents = [
                                                {
                                                                        type: 'INCIDENT_ALERT',
                                                                        title: 'Incident #402: Latency spike to 1800ms',
                                                                        service: 'legacy-payment-gateway',
                                                                        author: 'Datadog Monitor',
                                                                        time: '2 mins ago',
                                                                        severity: 'HIGH',
                                                },
                                                {
                                                                        type: 'DEPLOYMENT',
                                                                        title: 'Deployed version v2.4.1 (commit 8f3b2a1)',
                                                                        service: 'legacy-payment-gateway',
                                                                        author: 'Alex Dev',
                                                                        time: '14 mins ago',
                                                                        severity: 'INFO',
                                                },
                                                {
                                                                        type: 'CODE_REVIEW',
                                                                        title: 'PR #142 Approved: Optimize DB query indexing',
                                                                        service: 'checkout-service',
                                                                        author: 'Sarah Lead',
                                                                        time: '28 mins ago',
                                                                        severity: 'INFO',
                                                },
                                                {
                                                                        type: 'COMMIT',
                                                                        title: 'Commit 1a4b8c2: Patch mTLS token rotation',
                                                                        service: 'auth-vault',
                                                                        author: 'Mike Sec',
                                                                        time: '45 mins ago',
                                                                        severity: 'INFO',
                                                },
                        ];

                        const userJourneys = [
                                                {
                                                                        name: 'E-Commerce Checkout & Payment Trajectory',
                                                                        entry: 'POST /api/v1/checkout/pay',
                                                                        p95: '442 ms',
                                                                        success: '97.6%',
                                                                        hops: [
                                                                                                {
                                                                                                                        seq: 1,
                                                                                                                        service: 'AWS ALB Ingress',
                                                                                                                        latency: '4 ms',
                                                                                                                        proto: 'HTTPS',
                                                                                                },
                                                                                                {
                                                                                                                        seq: 2,
                                                                                                                        service: 'API Gateway Route',
                                                                                                                        latency: '14 ms',
                                                                                                                        proto: 'HTTP/2',
                                                                                                },
                                                                                                {
                                                                                                                        seq: 3,
                                                                                                                        service: 'Checkout API',
                                                                                                                        latency: '42 ms',
                                                                                                                        proto: 'gRPC',
                                                                                                },
                                                                                                {
                                                                                                                        seq: 4,
                                                                                                                        service: 'Legacy Payment Gateway',
                                                                                                                        latency: '360 ms',
                                                                                                                        proto: 'REST',
                                                                                                },
                                                                                                {
                                                                                                                        seq: 5,
                                                                                                                        service: 'Postgres Primary DB',
                                                                                                                        latency: '22 ms',
                                                                                                                        proto: 'SQL',
                                                                                                },
                                                                        ],
                                                },
                        ];

                        const serviceRadars = [
                                                {
                                                                        service: 'auth-vault-service',
                                                                        score: '98.2',
                                                                        avail: '100%',
                                                                        lat: '98.0%',
                                                                        err: '99.9%',
                                                                        sec: '98.5%',
                                                                        sat: '94.6%',
                                                                        rating: 'EXCELLENT',
                                                },
                                                {
                                                                        service: 'checkout-api',
                                                                        score: '88.4',
                                                                        avail: '99.2%',
                                                                        lat: '82.0%',
                                                                        err: '97.6%',
                                                                        sec: '94.0%',
                                                                        sat: '69.2%',
                                                                        rating: 'GOOD',
                                                },
                                                {
                                                                        service: 'legacy-payment-gateway',
                                                                        score: '64.8',
                                                                        avail: '88.0%',
                                                                        lat: '42.0%',
                                                                        err: '68.4%',
                                                                        sec: '54.0%',
                                                                        sat: '71.6%',
                                                                        rating: 'DEGRADED',
                                                },
                        ];

                        const infrastructureDrifts = [
                                                {
                                                                        resource: 'k8s/deployments/checkout-service.yaml',
                                                                        target: 'checkout-api-pod-1',
                                                                        intended: 'replicas: 4',
                                                                        deployed: 'replicas: 8 (Manual kubectl scale executed)',
                                                                        type: 'REPLICA_COUNT_MISMATCH',
                                                                        severity: 'WARNING',
                                                },
                                                {
                                                                        resource: 'terraform/postgres_rds.tf',
                                                                        target: 'postgres-primary-db',
                                                                        intended: 'max_connections: 100',
                                                                        deployed: 'max_connections: 250 (Hot-patched in parameter group)',
                                                                        type: 'PARAMETER_GROUP_DRIFT',
                                                                        severity: 'CRITICAL',
                                                },
                        ];

                        const reliabilityScores = [
                                                {
                                                                        service: 'auth-vault-service',
                                                                        score: 99.4,
                                                                        uptime: '99.99%',
                                                                        mttr: '4.2m',
                                                                        mtbf: '180d',
                                                                        rating: 'EXCELLENT',
                                                },
                                                {
                                                                        service: 'checkout-api',
                                                                        score: 92.1,
                                                                        uptime: '99.90%',
                                                                        mttr: '8.5m',
                                                                        mtbf: '42d',
                                                                        rating: 'STABLE',
                                                },
                                                {
                                                                        service: 'legacy-payment-gateway',
                                                                        score: 68.2,
                                                                        uptime: '98.40%',
                                                                        mttr: '45.0m',
                                                                        mtbf: '6.5d',
                                                                        rating: 'UNSTABLE',
                                                },
                        ];

                        const sloSlaDashboard = [
                                                {
                                                                        service: 'checkout-api',
                                                                        target: '99.9% Uptime, p99 < 50ms',
                                                                        current: '99.90%, p99 = 42ms',
                                                                        compliance: 'COMPLIANT',
                                                                        budget: '84.2%',
                                                },
                                                {
                                                                        service: 'legacy-payment-gateway',
                                                                        target: '99.0% Uptime, p95 < 200ms',
                                                                        current: '98.40%, p95 = 1800ms',
                                                                        compliance: 'SLO_BREACH',
                                                                        budget: '0.0% (EXHAUSTED)',
                                                },
                        ];

                        const aiAdviceList = [
                                                {
                                                                        title: 'Scale checkout-api HPA pod range from (4..8) to (8..16)',
                                                                        impact: 'Reduces p99 latency by 34% during surges',
                                                                        effort: 'LOW',
                                                },
                                                {
                                                                        title: 'Apply concurrent SQL index on legacy_transactions(created_at)',
                                                                        impact: 'Eliminates DB connection pool exhaustion',
                                                                        effort: 'MEDIUM',
                                                },
                                                {
                                                                        title: 'Migrate staging workloads to AWS Spot instances in us-west-2',
                                                                        impact: 'Saves $640/mo and cuts CO2e by 28%',
                                                                        effort: 'LOW',
                                                },
                        ];

                        const crossEnvComp = [
                                                {
                                                                        dim: 'K8s Cluster Pods',
                                                                        dev: '12 Pods (1 Node)',
                                                                        staging: '24 Pods (3 Nodes)',
                                                                        prod: '84 Pods (12 Nodes)',
                                                                        status: 'ALIGNED',
                                                },
                                                {
                                                                        dim: 'Postgres Max Connections',
                                                                        dev: '50',
                                                                        staging: '100',
                                                                        prod: '250 (Hot-patched)',
                                                                        status: 'DRIFT_FLAGGED',
                                                },
                                                {
                                                                        dim: 'Average p95 Latency',
                                                                        dev: '12ms',
                                                                        staging: '18ms',
                                                                        prod: '42ms',
                                                                        status: 'EXPECTED_LOAD_DELTA',
                                                },
                        ];

                        const historicalReplaySteps = [
                                                {
                                                                        min: '0m',
                                                                        event: 'Deployment v2.4.1 synced by ArgoCD',
                                                                        latency: '45ms',
                                                                        err: '0.01%',
                                                                        status: 'RUNNING',
                                                },
                                                {
                                                                        min: '3m',
                                                                        event: 'Unindexed SQL query execution begins',
                                                                        latency: '180ms',
                                                                        err: '0.10%',
                                                                        status: 'SCALING',
                                                },
                                                {
                                                                        min: '6m',
                                                                        event: 'Postgres DB Connection Pool reaches 100% saturation',
                                                                        latency: '940ms',
                                                                        err: '4.20%',
                                                                        status: 'DEGRADED',
                                                },
                                                {
                                                                        min: '10m',
                                                                        event: 'Prometheus & Datadog trigger High Severity Incident #402',
                                                                        latency: '1800ms',
                                                                        err: '14.2%',
                                                                        status: 'FAILED',
                                                },
                                                {
                                                                        min: '14m',
                                                                        event: 'Auto-remediation applies DB index and expands pool limit',
                                                                        latency: '48ms',
                                                                        err: '0.01%',
                                                                        status: 'RECOVERED',
                                                },
                        ];

                        const executiveKPIs = {
                                                health: '93.5%',
                                                slo_compliance: '98.4%',
                                                cost: '$4,820.00 / mo',
                                                co2: '10.11 MT / yr',
                                                incidents: 1,
                                                velocity: '94.2 / 100',
                        };

                        const getStatusBadge = (status: string) => {
                                                switch (status) {
                                                                        case 'RUNNING':
                                                                                                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                                                                        case 'SCALING':
                                                                                                return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                                                                        case 'DEGRADED':
                                                                                                return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
                                                                        case 'RECOVERING':
                                                                                                return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
                                                                        case 'FAILED':
                                                                                                return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
                                                                        default:
                                                                                                return 'bg-slate-800 text-slate-400 border-slate-700';
                                                }
                        };

                        const handleSimulateOutage = () => {
                                                setSimulating(true);
                                                setTimeout(() => {
                                                                        setSimResult({
                                                                                                title: 'Incident Simulation: Primary Auth Vault Node Outage',
                                                                                                blast_radius: [
                                                                                                                        'checkout-service (DEGRADED)',
                                                                                                                        'orders-router (DEGRADED)',
                                                                                                ],
                                                                                                recovery_time_mins: 12,
                                                                                                mitigation: 'Automated failover to Auth Replica Vault executed in 4.2 seconds.',
                                                                        });
                                                                        setSimulating(false);
                                                }, 400);
                        };

                        const handleRunAiCommander = () => {
                                                setAiLoading(true);
                                                setTimeout(() => {
                                                                        setAiResponse({
                                                                                                status: 'ACTIVE_TRIAGE',
                                                                                                summary: 'Incident #402: Latency spike in legacy-payment-gateway (1800ms p95).',
                                                                                                causes: [
                                                                                                                        '1. Database Connection Pool Exhaustion triggered by missing index on legacy_transactions.',
                                                                                                                        '2. Thread pool starvation in legacy-payment-gateway worker process.',
                                                                                                ],
                                                                                                steps: [
                                                                                                                        'Step 1: Inspect active queries: SELECT * FROM pg_stat_activity WHERE state = "active";',
                                                                                                                        'Step 2: Check K8s pod CPU/Memory throttling on legacy-payment-gateway deployment.',
                                                                                                                        'Step 3: Run quick rollback trial to v2.4.0 using ArgoCD sync CLI.',
                                                                                                ],
                                                                                                remediation_cmd: 'npx codeatlas-cli reality remediate --incident-id=inc-402 --action=apply-db-index',
                                                                        });
                                                                        setAiLoading(false);
                                                }, 500);
                        };

                        return (
                                                <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
                                                                        {/* Header */}
                                                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
                                                                                                <div>
                                                                                                                        <div className="flex items-center gap-3 mb-2">
                                                                                                                                                <div className="p-2.5 bg-emerald-600/20 border border-emerald-500/30 rounded-xl text-emerald-400">
                                                                                                                                                                        <Activity className="w-8 h-8" />
                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                                                                                                                                                                                                Phase
                                                                                                                                                                                                21
                                                                                                                                                                                                •
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Reality
                                                                                                                                                                                                Engine
                                                                                                                                                                                                (Digital
                                                                                                                                                                                                Twin
                                                                                                                                                                                                2.0)
                                                                                                                                                                        </span>
                                                                                                                                                                        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
                                                                                                                                                                                                Real-Time
                                                                                                                                                                                                Software
                                                                                                                                                                                                Reality
                                                                                                                                                                                                Command
                                                                                                                                                                                                Center
                                                                                                                                                                        </h1>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                        <p className="text-slate-400 text-sm max-w-3xl">
                                                                                                                                                Single
                                                                                                                                                source
                                                                                                                                                of
                                                                                                                                                engineering
                                                                                                                                                truth
                                                                                                                                                combining
                                                                                                                                                runtime
                                                                                                                                                states,
                                                                                                                                                APM
                                                                                                                                                telemetry,
                                                                                                                                                event
                                                                                                                                                streams,
                                                                                                                                                user
                                                                                                                                                journey
                                                                                                                                                maps,
                                                                                                                                                5-axis
                                                                                                                                                health
                                                                                                                                                radars,
                                                                                                                                                infrastructure
                                                                                                                                                drift
                                                                                                                                                detection,
                                                                                                                                                and
                                                                                                                                                the
                                                                                                                                                Runtime
                                                                                                                                                Knowledge
                                                                                                                                                Graph.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                {/* Health Card */}
                                                                                                <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                                                                                                                        <div className="text-center px-3 border-r border-slate-800">
                                                                                                                                                <span className="text-xs text-slate-400 font-medium block">
                                                                                                                                                                        Reality
                                                                                                                                                                        Health
                                                                                                                                                </span>
                                                                                                                                                <span className="text-2xl font-extrabold text-emerald-400">
                                                                                                                                                                        {
                                                                                                                                                                                                realityHealth.score
                                                                                                                                                                        }

                                                                                                                                                                        %
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <div className="text-center px-3">
                                                                                                                                                <span className="text-xs text-slate-400 font-medium block">
                                                                                                                                                                        Digital
                                                                                                                                                                        Twin
                                                                                                                                                                        Sync
                                                                                                                                                </span>
                                                                                                                                                <span className="text-sm font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded mt-1 inline-block">
                                                                                                                                                                        ●
                                                                                                                                                                        REALTIME
                                                                                                                                                                        SYNC
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* 16. Engineering Event Stream */}
                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                                                                                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                                                                                                        <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                                                                                                                                                <Radio className="w-5 h-5 text-indigo-400" />{' '}
                                                                                                                                                Engineering
                                                                                                                                                Event
                                                                                                                                                Stream
                                                                                                                                                (Live
                                                                                                                                                Feed)
                                                                                                                        </h2>
                                                                                                                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                                                                                                                                                ●
                                                                                                                                                1,420
                                                                                                                                                Events
                                                                                                                                                24h
                                                                                                                        </span>
                                                                                                </div>

                                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                                                                                                        {engineeringEvents.map(
                                                                                                                                                (
                                                                                                                                                                        evt,
                                                                                                                                                                        idx
                                                                                                                                                ) => (
                                                                                                                                                                        <div
                                                                                                                                                                                                key={
                                                                                                                                                                                                                        idx
                                                                                                                                                                                                }
                                                                                                                                                                                                className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-1"
                                                                                                                                                                        >
                                                                                                                                                                                                <div className="flex justify-between items-center">
                                                                                                                                                                                                                        <span className="font-extrabold text-white">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        evt.title
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        evt.type
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="flex justify-between text-slate-400 text-[11px]">
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                Service:{' '}
                                                                                                                                                                                                                                                <strong className="text-slate-200">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                evt.service
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </strong>{' '}
                                                                                                                                                                                                                                                •{' '}
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        evt.author
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        evt.time
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                )
                                                                                                                        )}
                                                                                                </div>
                                                                        </div>

                                                                        {/* 17. User Journey Map */}
                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                                                                                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                                                                                                        <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                                                                                                                                                <Share2 className="w-5 h-5 text-cyan-400" />{' '}
                                                                                                                                                User
                                                                                                                                                Journey
                                                                                                                                                Map
                                                                                                                                                (Request
                                                                                                                                                Trajectories)
                                                                                                                        </h2>
                                                                                                                        <span className="text-xs text-slate-400">
                                                                                                                                                Showing
                                                                                                                                                multi-hop
                                                                                                                                                request
                                                                                                                                                flow
                                                                                                                        </span>
                                                                                                </div>

                                                                                                {userJourneys.map(
                                                                                                                        (
                                                                                                                                                uj,
                                                                                                                                                idx
                                                                                                                        ) => (
                                                                                                                                                <div
                                                                                                                                                                        key={
                                                                                                                                                                                                idx
                                                                                                                                                                        }
                                                                                                                                                                        className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3 text-xs"
                                                                                                                                                >
                                                                                                                                                                        <div className="flex justify-between items-center">
                                                                                                                                                                                                <span className="font-extrabold text-white text-sm">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                uj.name
                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                uj.entry
                                                                                                                                                                                                                        }

                                                                                                                                                                                                                        )
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="font-bold text-emerald-400">
                                                                                                                                                                                                                        p95:{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                uj.p95
                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                        •
                                                                                                                                                                                                                        Success:{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                uj.success
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                                                                                                                                                                                                {uj.hops.map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                hop,
                                                                                                                                                                                                                                                hidx
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <React.Fragment
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                hidx
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                                                                                                                                                                                                                                                                                                <span className="font-bold text-slate-200 block">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                hop.seq
                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                        .{' '}
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                hop.service
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span className="text-cyan-400">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                hop.latency
                                                                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                hop.proto
                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        {hidx <
                                                                                                                                                                                                                                                                                                uj
                                                                                                                                                                                                                                                                                                                        .hops
                                                                                                                                                                                                                                                                                                                        .length -
                                                                                                                                                                                                                                                                                                                        1 && (
                                                                                                                                                                                                                                                                                                <ArrowRight className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                                                                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                                                </React.Fragment>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        )
                                                                                                )}
                                                                        </div>

                                                                        {/* 18. Service Health Radar & 19. Infrastructure Drift Detection */}
                                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                                                                {/* 18. Service Health Radar */}
                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                                                                                                                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                                                                                                                                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                        <Sliders className="w-5 h-5 text-purple-400" />{' '}
                                                                                                                                                                        Service
                                                                                                                                                                        Health
                                                                                                                                                                        Radar
                                                                                                                                                                        (5-Axis
                                                                                                                                                                        Scores)
                                                                                                                                                </h2>
                                                                                                                                                <span className="text-xs text-slate-400">
                                                                                                                                                                        Avail
                                                                                                                                                                        •
                                                                                                                                                                        Latency
                                                                                                                                                                        •
                                                                                                                                                                        Error
                                                                                                                                                                        •
                                                                                                                                                                        Sec
                                                                                                                                                                        •
                                                                                                                                                                        Saturation
                                                                                                                                                </span>
                                                                                                                        </div>

                                                                                                                        <div className="space-y-3 text-xs">
                                                                                                                                                {serviceRadars.map(
                                                                                                                                                                        (
                                                                                                                                                                                                sr,
                                                                                                                                                                                                idx
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-1.5"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <div className="flex justify-between items-center">
                                                                                                                                                                                                                                                <span className="font-extrabold text-white">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                sr.service
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                                                                                                                                                                                                                                                                        Overall:{' '}
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                sr.score
                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                sr.rating
                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="grid grid-cols-5 gap-1 text-center text-[10px] text-slate-300">
                                                                                                                                                                                                                                                <div className="bg-slate-900 p-1 rounded">
                                                                                                                                                                                                                                                                        Avail:{' '}
                                                                                                                                                                                                                                                                        <strong>
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        sr.avail
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </strong>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div className="bg-slate-900 p-1 rounded">
                                                                                                                                                                                                                                                                        Lat:{' '}
                                                                                                                                                                                                                                                                        <strong>
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        sr.lat
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </strong>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div className="bg-slate-900 p-1 rounded">
                                                                                                                                                                                                                                                                        Err:{' '}
                                                                                                                                                                                                                                                                        <strong>
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        sr.err
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </strong>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div className="bg-slate-900 p-1 rounded">
                                                                                                                                                                                                                                                                        Sec:{' '}
                                                                                                                                                                                                                                                                        <strong>
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        sr.sec
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </strong>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div className="bg-slate-900 p-1 rounded">
                                                                                                                                                                                                                                                                        Sat:{' '}
                                                                                                                                                                                                                                                                        <strong>
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        sr.sat
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </strong>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* 19. Infrastructure Drift Detection */}
                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                                                                                                                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                                                                                                                                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                        <GitBranch className="w-5 h-5 text-amber-400" />{' '}
                                                                                                                                                                        Infrastructure
                                                                                                                                                                        Drift
                                                                                                                                                                        Detection
                                                                                                                                                </h2>
                                                                                                                                                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                                                                                                                                                                        2
                                                                                                                                                                        Drifts
                                                                                                                                                                        Flagged
                                                                                                                                                </span>
                                                                                                                        </div>

                                                                                                                        <div className="space-y-3 text-xs">
                                                                                                                                                {infrastructureDrifts.map(
                                                                                                                                                                        (
                                                                                                                                                                                                d,
                                                                                                                                                                                                idx
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-1 text-xs"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <div className="flex justify-between items-center">
                                                                                                                                                                                                                                                <span className="font-extrabold text-white">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                d.resource
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span
                                                                                                                                                                                                                                                                        className={`font-bold text-[10px] px-2 py-0.5 rounded border ${d.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                d.type
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="text-slate-400 text-[11px]">
                                                                                                                                                                                                                                                Intended:{' '}
                                                                                                                                                                                                                                                <code className="text-emerald-400">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                d.intended
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </code>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="text-slate-400 text-[11px]">
                                                                                                                                                                                                                                                Deployed:{' '}
                                                                                                                                                                                                                                                <code className="text-rose-400">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                d.deployed
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </code>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* 20. Runtime Knowledge Graph */}
                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                                                                                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                                                                                                        <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                                                                                                                                                <Layers className="w-5 h-5 text-indigo-400" />{' '}
                                                                                                                                                Runtime
                                                                                                                                                Knowledge
                                                                                                                                                Graph
                                                                                                                                                (Code
                                                                                                                                                +
                                                                                                                                                Live
                                                                                                                                                Operational
                                                                                                                                                Data)
                                                                                                                        </h2>
                                                                                                                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                                                                                                                                                ●
                                                                                                                                                18
                                                                                                                                                Nodes,
                                                                                                                                                24
                                                                                                                                                Live
                                                                                                                                                Edges
                                                                                                                        </span>
                                                                                                </div>

                                                                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                                                                                                                        {runtimeNodes.map(
                                                                                                                                                (
                                                                                                                                                                        node,
                                                                                                                                                                        idx
                                                                                                                                                ) => (
                                                                                                                                                                        <div
                                                                                                                                                                                                key={
                                                                                                                                                                                                                        idx
                                                                                                                                                                                                }
                                                                                                                                                                                                className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2"
                                                                                                                                                                        >
                                                                                                                                                                                                <div className="flex justify-between items-center">
                                                                                                                                                                                                                        <span className="font-extrabold text-white text-sm">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        node.name
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span
                                                                                                                                                                                                                                                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(node.status)}`}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        node.status
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <span className="text-[11px] text-cyan-400 font-semibold block">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                node.type
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <div className="text-slate-400 text-[11px] space-y-0.5 border-t border-slate-800/80 pt-1.5">
                                                                                                                                                                                                                        <div>
                                                                                                                                                                                                                                                CPU:{' '}
                                                                                                                                                                                                                                                <strong className="text-white">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                node.cpu
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </strong>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div>
                                                                                                                                                                                                                                                Memory:{' '}
                                                                                                                                                                                                                                                <strong className="text-white">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                node.memory
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </strong>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                )
                                                                                                                        )}
                                                                                                </div>
                                                                        </div>

                                                                        {/* 32. Plugin Connectors Grid & 34. Reality Synchronization Engine */}
                                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                                                                {/* 32. Plugin Connectors */}
                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                                                                                                                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                                                                                                                                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                        <Share2 className="w-5 h-5 text-indigo-400" />{' '}
                                                                                                                                                                        Plugin
                                                                                                                                                                        Connectors
                                                                                                                                                                        (9
                                                                                                                                                                        Active
                                                                                                                                                                        integrations)
                                                                                                                                                </h2>
                                                                                                                                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                                                                                                                                                                        ALL
                                                                                                                                                                        CONNECTED
                                                                                                                                                </span>
                                                                                                                        </div>

                                                                                                                        <div className="space-y-3 text-xs">
                                                                                                                                                <div>
                                                                                                                                                                        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block mb-1">
                                                                                                                                                                                                Cloud
                                                                                                                                                                                                Providers
                                                                                                                                                                        </span>
                                                                                                                                                                        <div className="grid grid-cols-3 gap-2">
                                                                                                                                                                                                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                                                                                                                                                                                                                        <div className="font-bold text-white">
                                                                                                                                                                                                                                                AWS
                                                                                                                                                                                                                                                EKS
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="text-[10px] text-emerald-400">
                                                                                                                                                                                                                                                ●
                                                                                                                                                                                                                                                Connected
                                                                                                                                                                                                                                                (12ms)
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                                                                                                                                                                                                                        <div className="font-bold text-white">
                                                                                                                                                                                                                                                GCP
                                                                                                                                                                                                                                                Engine
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="text-[10px] text-emerald-400">
                                                                                                                                                                                                                                                ●
                                                                                                                                                                                                                                                Connected
                                                                                                                                                                                                                                                (18ms)
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                                                                                                                                                                                                                        <div className="font-bold text-white">
                                                                                                                                                                                                                                                Azure
                                                                                                                                                                                                                                                AKS
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="text-[10px] text-emerald-400">
                                                                                                                                                                                                                                                ●
                                                                                                                                                                                                                                                Connected
                                                                                                                                                                                                                                                (22ms)
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                <div>
                                                                                                                                                                        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block mb-1">
                                                                                                                                                                                                Monitoring
                                                                                                                                                                                                &
                                                                                                                                                                                                CI/CD
                                                                                                                                                                        </span>
                                                                                                                                                                        <div className="grid grid-cols-3 gap-2">
                                                                                                                                                                                                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                                                                                                                                                                                                                        <div className="font-bold text-white">
                                                                                                                                                                                                                                                Datadog
                                                                                                                                                                                                                                                APM
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="text-[10px] text-emerald-400">
                                                                                                                                                                                                                                                ●
                                                                                                                                                                                                                                                Connected
                                                                                                                                                                                                                                                (8ms)
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                                                                                                                                                                                                                        <div className="font-bold text-white">
                                                                                                                                                                                                                                                Prometheus
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="text-[10px] text-emerald-400">
                                                                                                                                                                                                                                                ●
                                                                                                                                                                                                                                                Connected
                                                                                                                                                                                                                                                (4ms)
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                                                                                                                                                                                                                        <div className="font-bold text-white">
                                                                                                                                                                                                                                                ArgoCD
                                                                                                                                                                                                                                                Sync
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="text-[10px] text-emerald-400">
                                                                                                                                                                                                                                                ●
                                                                                                                                                                                                                                                Connected
                                                                                                                                                                                                                                                (6ms)
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* 33. Explainable Operational AI */}
                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                                                                                                                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                                                                                                                                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                        <Bot className="w-5 h-5 text-cyan-400" />{' '}
                                                                                                                                                                        Explainable
                                                                                                                                                                        Operational
                                                                                                                                                                        AI
                                                                                                                                                </h2>
                                                                                                                                                <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded">
                                                                                                                                                                        REASONING
                                                                                                                                                                        &
                                                                                                                                                                        TRADE-OFFS
                                                                                                                                                </span>
                                                                                                                        </div>

                                                                                                                        <div className="space-y-3 text-xs">
                                                                                                                                                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                                                                                                                                                                        <div className="flex justify-between items-center">
                                                                                                                                                                                                <span className="font-extrabold text-white">
                                                                                                                                                                                                                        Apply
                                                                                                                                                                                                                        CONCURRENT
                                                                                                                                                                                                                        SQL
                                                                                                                                                                                                                        Index
                                                                                                                                                                                                                        on
                                                                                                                                                                                                                        legacy_transactions
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                                                                                                                                                                                                                        96.8%
                                                                                                                                                                                                                        Confidence
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <p className="text-slate-300 text-[11px]">
                                                                                                                                                                                                <strong>
                                                                                                                                                                                                                        Reasoning:
                                                                                                                                                                                                </strong>{' '}
                                                                                                                                                                                                14
                                                                                                                                                                                                slow
                                                                                                                                                                                                queries/min
                                                                                                                                                                                                taking
                                                                                                                                                                                                1840ms
                                                                                                                                                                                                hold
                                                                                                                                                                                                open
                                                                                                                                                                                                78.4%
                                                                                                                                                                                                of
                                                                                                                                                                                                DB
                                                                                                                                                                                                pool.
                                                                                                                                                                        </p>
                                                                                                                                                                        <p className="text-amber-400/90 text-[11px]">
                                                                                                                                                                                                <strong>
                                                                                                                                                                                                                        Trade-offs:
                                                                                                                                                                                                </strong>{' '}
                                                                                                                                                                                                +0.4ms
                                                                                                                                                                                                INSERT
                                                                                                                                                                                                write
                                                                                                                                                                                                update
                                                                                                                                                                                                cost
                                                                                                                                                                                                on
                                                                                                                                                                                                new
                                                                                                                                                                                                transactions.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Section 16: Reality Simulation Console */}
                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                                                                                                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                                                                                                        <div>
                                                                                                                                                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                        <Zap className="w-5 h-5 text-amber-400" />{' '}
                                                                                                                                                                        Reality
                                                                                                                                                                        Simulation
                                                                                                                                                                        &
                                                                                                                                                                        Outage
                                                                                                                                                                        Predictor
                                                                                                                                                </h2>
                                                                                                                                                <p className="text-slate-400 text-xs mt-0.5">
                                                                                                                                                                        Simulate
                                                                                                                                                                        production
                                                                                                                                                                        outages
                                                                                                                                                                        and
                                                                                                                                                                        10x
                                                                                                                                                                        traffic
                                                                                                                                                                        spikes
                                                                                                                                                                        before
                                                                                                                                                                        deployment.
                                                                                                                                                </p>
                                                                                                                        </div>
                                                                                                                        <button
                                                                                                                                                onClick={
                                                                                                                                                                        handleSimulateOutage
                                                                                                                                                }
                                                                                                                                                disabled={
                                                                                                                                                                        simulating
                                                                                                                                                }
                                                                                                                                                className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-amber-600/30"
                                                                                                                        >
                                                                                                                                                {simulating ? (
                                                                                                                                                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                                                                                                                                ) : (
                                                                                                                                                                        <Play className="w-4 h-4" />
                                                                                                                                                )}
                                                                                                                                                Simulate
                                                                                                                                                Node
                                                                                                                                                Outage
                                                                                                                                                Blast
                                                                                                                                                Radius
                                                                                                                        </button>
                                                                                                </div>

                                                                                                {simResult && (
                                                                                                                        <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                                                                                                                                                <h3 className="font-bold text-white text-base flex items-center gap-2">
                                                                                                                                                                        <AlertTriangle className="w-5 h-5 text-amber-400" />{' '}
                                                                                                                                                                        {
                                                                                                                                                                                                simResult.title
                                                                                                                                                                        }
                                                                                                                                                </h3>
                                                                                                                                                <div className="text-xs text-slate-300 space-y-1">
                                                                                                                                                                        <div>
                                                                                                                                                                                                Affected
                                                                                                                                                                                                Blast
                                                                                                                                                                                                Radius:{' '}
                                                                                                                                                                                                <span className="font-bold text-rose-400">
                                                                                                                                                                                                                        {simResult.blast_radius.join(
                                                                                                                                                                                                                                                ' • '
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div>
                                                                                                                                                                                                Estimated
                                                                                                                                                                                                Recovery
                                                                                                                                                                                                Time:{' '}
                                                                                                                                                                                                <span className="font-bold text-white">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                simResult.recovery_time_mins
                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                        minutes
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div>
                                                                                                                                                                                                Automated
                                                                                                                                                                                                Mitigation:{' '}
                                                                                                                                                                                                <span className="font-bold text-emerald-400">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                simResult.mitigation
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                )}
                                                                        </div>
                                                </div>
                        );
}
