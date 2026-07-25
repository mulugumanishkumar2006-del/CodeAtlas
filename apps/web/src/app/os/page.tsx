'use client';

import React, { useState } from 'react';
import {
                        Monitor,
                        Cpu,
                        Search,
                        CheckCircle2,
                        AlertCircle,
                        Activity,
                        Layers,
                        Sparkles,
                        Zap,
                        Terminal,
                        Server,
                        ShieldCheck,
                        RotateCw,
                        ArrowRight,
                        GitBranch,
                        BookOpen,
                        Kanban,
                        UserCheck,
                        Clock,
                        Database,
                        Play,
                        Settings,
                        Grid,
                        Box,
                        MessageSquare,
                        Cloud,
                        BarChart2,
} from 'lucide-react';

export default function CodeAtlasOSPage() {
                        const [selectedRole, setSelectedRole] = useState('CTO');
                        const [searchDomain, setSearchDomain] = useState('All');
                        const [searchQuery, setSearchQuery] = useState('Authentication');
                        const [activeTab, setActiveTab] = useState('copilot'); // copilot, search, memory, timeline, roles, integrations, marketplace, matrix

                        const [queryInput, setQueryInput] = useState(
                                                'Which service is our biggest scalability risk?'
                        );
                        const [isQuerying, setIsQuerying] = useState(false);
                        const [activeQueryResult, setActiveQueryResult] = useState<any>({
                                                category: 'Scalability Risk',
                                                headline: 'analytics-ingestion-worker is the #1 scalability risk.',
                                                details: [
                                                                        "Unindexed database query on 'events_raw' table creates bottleneck at > 15,000 RPM.",
                                                                        'Datadog APM metrics show CPU utilization spikes to 94% under load.',
                                                                        "Recommendation: Apply Redis L2 caching and add index on 'events_raw(timestamp, user_id)'.",
                                                ],
                                                confidence: '98.2%',
                                                subsystems: [
                                                                        'Repository Intelligence',
                                                                        'Digital Twin Engine',
                                                                        'AI CTO Council',
                                                                        'Autonomous Engineering',
                                                                        'Enterprise Intelligence',
                                                ],
                        });

                        const presetQueries = [
                                                'Which service is our biggest scalability risk?',
                                                'Why did latency increase after Release 3.2?',
                                                'Which repository should be modernized first?',
                                                'What is our engineering ROI?',
                                                'Can our architecture support 100 million users?',
                                                'Which team owns the checkout workflow?',
                                                'What is blocking our release?',
                        ];

                        const searchDomains = [
                                                'All',
                                                'Code',
                                                'ADRs',
                                                'APIs',
                                                'Documentation',
                                                'Incidents',
                                                'Pull Requests',
                                                'Commits',
                                                'Architecture',
                                                'Metrics',
                        ];

                        const roleDashboards: Record<string, any> = {
                                                Developer: {
                                                                        primary_focus: 'Code Quality, Fast PR Feedback, and Local Workspace Productivity',
                                                                        widgets: [
                                                                                                {
                                                                                                                        title: 'My Open PRs & Code Reviews',
                                                                                                                        metric: '3 Pending Reviews',
                                                                                                                        status: 'OPTIMAL',
                                                                                                },
                                                                                                {
                                                                                                                        title: 'Local Branch Health & Linter Warnings',
                                                                                                                        metric: '0 Errors, 2 Warnings',
                                                                                                                        status: 'PASSED',
                                                                                                },
                                                                                                {
                                                                                                                        title: 'Automated Pre-PR Guard Check',
                                                                                                                        metric: 'ALL GATES GREEN',
                                                                                                                        status: 'PASSED',
                                                                                                },
                                                                        ],
                                                },
                                                'Tech Lead': {
                                                                        primary_focus: 'Sprint Delivery, Team Knowledge Distribution, and Code Review Velocity',
                                                                        widgets: [
                                                                                                {
                                                                                                                        title: 'Team Sprint Velocity & Debt Items',
                                                                                                                        metric: '42 Story Points / Sprint',
                                                                                                                        status: 'ON_TRACK',
                                                                                                },
                                                                                                {
                                                                                                                        title: 'Bus Factor & Ownership Hotspots',
                                                                                                                        metric: '1 High Risk Hotspot',
                                                                                                                        status: 'WARNING',
                                                                                                },
                                                                                                {
                                                                                                                        title: 'Code Review Bottlenecks',
                                                                                                                        metric: 'Avg Review Time: 1.4 Hours',
                                                                                                                        status: 'OPTIMAL',
                                                                                                },
                                                                        ],
                                                },
                                                Architect: {
                                                                        primary_focus: 'System Scalability, Architectural Consistency, and Technical Standards',
                                                                        widgets: [
                                                                                                {
                                                                                                                        title: 'Enterprise Knowledge Graph & ADRs',
                                                                                                                        metric: '142 Services Mapped',
                                                                                                                        status: 'OPTIMAL',
                                                                                                },
                                                                                                {
                                                                                                                        title: 'Architecture Drift & Standard Violations',
                                                                                                                        metric: '98.4% Compliance',
                                                                                                                        status: 'PASSED',
                                                                                                },
                                                                                                {
                                                                                                                        title: 'Multi-Repo Dependency Map',
                                                                                                                        metric: '0 Circular Dependencies',
                                                                                                                        status: 'PASSED',
                                                                                                },
                                                                        ],
                                                },
                                                SRE: {
                                                                        primary_focus: 'System Reliability, Incident Mitigation, and Infrastructure Resilience',
                                                                        widgets: [
                                                                                                {
                                                                                                                        title: 'Datadog APM & Latency Telemetry',
                                                                                                                        metric: 'p95 Latency: 42ms',
                                                                                                                        status: 'OPTIMAL',
                                                                                                },
                                                                                                {
                                                                                                                        title: 'Live Incident Stream & Outage Predictor',
                                                                                                                        metric: '0 Active Incidents',
                                                                                                                        status: 'HEALTHY',
                                                                                                },
                                                                                                {
                                                                                                                        title: 'Kubernetes Cluster Capacity & IOPS',
                                                                                                                        metric: '62% Capacity Utilization',
                                                                                                                        status: 'OPTIMAL',
                                                                                                },
                                                                        ],
                                                },
                                                QA: {
                                                                        primary_focus: 'Test Automation, Regression Prevention, and Release Quality',
                                                                        widgets: [
                                                                                                {
                                                                                                                        title: 'Automated Test Coverage Matrix',
                                                                                                                        metric: '84.5% Code Coverage',
                                                                                                                        status: 'OPTIMAL',
                                                                                                },
                                                                                                {
                                                                                                                        title: 'Regression Risk Analyzer Engine',
                                                                                                                        metric: 'Low Risk Score: 4.2%',
                                                                                                                        status: 'PASSED',
                                                                                                },
                                                                                                {
                                                                                                                        title: 'Flaky Test Detector & Pipeline Runs',
                                                                                                                        metric: '99.2% Pipeline Success',
                                                                                                                        status: 'PASSED',
                                                                                                },
                                                                        ],
                                                },
                                                CTO: {
                                                                        primary_focus: 'Executive Governance, Engineering ROI, Cost Efficiency, and Strategic Roadmap',
                                                                        widgets: [
                                                                                                {
                                                                                                                        title: 'Organization Health Score & DORA KPIs',
                                                                                                                        metric: '93.0 / 100 Health',
                                                                                                                        status: 'EXCELLENT',
                                                                                                },
                                                                                                {
                                                                                                                        title: 'Engineering Cost & ROI Summary',
                                                                                                                        metric: '$1.45M Cost Avoidance',
                                                                                                                        status: '7.4x ROI',
                                                                                                },
                                                                                                {
                                                                                                                        title: 'Executive AI Strategy Advisory',
                                                                                                                        metric: 'Top Priority: Modernize Legacy Payments',
                                                                                                                        status: 'RECOMMENDED',
                                                                                                },
                                                                        ],
                                                },
                        };

                        const universalSearchMock = [
                                                {
                                                                        domain: 'Code',
                                                                        title: 'OAuth2TokenVerifier.verify_jwt_signature()',
                                                                        snippet: 'app/core/security/verifier.py: Line 45 • Validates RSA256 signature for incoming bearer tokens.',
                                                                        target: '/repository-dna?file=verifier.py',
                                                },
                                                {
                                                                        domain: 'ADRs',
                                                                        title: 'ADR-042: Event-Driven Microservices Architecture',
                                                                        snippet: 'docs/architecture/adr-042.md • Decision to adopt Kafka for cross-service event bus.',
                                                                        target: '/knowledge?tab=adrs',
                                                },
                                                {
                                                                        domain: 'APIs',
                                                                        title: 'POST /api/v1/auth/token',
                                                                        snippet: 'OpenAPI Spec v3.1 • Auth Gateway service endpoint returning JWT access tokens.',
                                                                        target: '/architecture?tab=apis',
                                                },
                                                {
                                                                        domain: 'Documentation',
                                                                        title: 'Checkout Workflow Disaster Recovery Runbook',
                                                                        snippet: 'Confluence Space: Payments • Instructions for database migration rollbacks.',
                                                                        target: '/knowledge?tab=docs',
                                                },
                                                {
                                                                        domain: 'Incidents',
                                                                        title: 'INC-2026-03-12: Redis Session Cache Saturation',
                                                                        snippet: 'Datadog Incident #819 • Latency spike +180ms caused by unexpired session keys.',
                                                                        target: '/reliability?tab=incidents',
                                                },
                                                {
                                                                        domain: 'Pull Requests',
                                                                        title: 'PR #481: Add Redis L2 caching to ingestion worker',
                                                                        snippet: 'GitHub Repo: analytics-service • Merged by lead.dev • Approved by AI CTO Gate.',
                                                                        target: '/autonomous?tab=prs',
                                                },
                                                {
                                                                        domain: 'Commits',
                                                                        title: 'Commit b819f2a: Optimize database index on events_raw',
                                                                        snippet: 'Author: solo.dev • Modified 3 files (+120, -45) in legacy-payment-gateway.',
                                                                        target: '/repository-dna?tab=commits',
                                                },
                                                {
                                                                        domain: 'Architecture',
                                                                        title: 'Bounded Context: Billing & Checkout Subsystem',
                                                                        snippet: 'Enterprise Map • Contains 4 microservices, 2 Redis caches, 1 Postgres primary.',
                                                                        target: '/enterprise-twin',
                                                },
                                                {
                                                                        domain: 'Metrics',
                                                                        title: 'p95 Latency & Throughput (RPM) Benchmark',
                                                                        snippet: 'Datadog APM • Average p95: 42ms | Peak RPM: 18,500 | Error Rate: 0.012%',
                                                                        target: '/command-center?tab=metrics',
                                                },
                        ];

                        const engineeringMemories = [
                                                {
                                                                        type: 'Decision',
                                                                        title: 'Adopt Event-Driven Architecture via Kafka for Order Processing',
                                                                        content: 'Decided in Q1 to decouple checkout payments from inventory using Kafka topics. Reduced p99 latency by 140ms.',
                                                                        role: 'Principal Architect',
                                                                        date: '2026-03-15',
                                                },
                                                {
                                                                        type: 'Incident',
                                                                        title: 'Postmortem: Unindexed Event Log Table IOPS Bottleneck',
                                                                        content: 'Root cause identified as missing compound index on events_raw. Mitigation: added migration script and Redis cache.',
                                                                        role: 'Lead SRE',
                                                                        date: '2026-03-18',
                                                },
                                                {
                                                                        type: 'Review',
                                                                        title: 'Pre-PR Automated Security Gate Review #481',
                                                                        content: 'AI CTO Council flagged synchronous HTTP call without timeout configuration. Remediated before PR approval.',
                                                                        role: 'AI CTO Gatekeeper',
                                                                        date: '2026-03-20',
                                                },
                                                {
                                                                        type: 'Architecture',
                                                                        title: 'Target Blueprint: Zero-Trust Microservices Mesh',
                                                                        content: 'Mandated mTLS via Istio sidecar proxies for all inter-service communications across 100+ repositories.',
                                                                        role: 'VP Engineering',
                                                                        date: '2026-03-22',
                                                },
                                                {
                                                                        type: 'Lesson',
                                                                        title: 'Lesson Learned: Database Read Replica Connection Pool Sizing',
                                                                        content: 'Discovered max_connections default was exhausting worker threads during peak traffic events.',
                                                                        role: 'Database Architect',
                                                                        date: '2026-03-24',
                                                },
                        ];

                        const timelineEvents = [
                                                {
                                                                        type: 'Deployment',
                                                                        title: 'Release v20.0.0-RC1 Deployed to Staging',
                                                                        details: 'Automated deployment via Jenkins Pipeline #482. 14 microservices updated.',
                                                                        severity: 'INFO',
                                                                        repo: 'enterprise-k8s-cluster',
                                                                        time: '10 mins ago',
                                                },
                                                {
                                                                        type: 'HealthChange',
                                                                        title: 'Organization Health Score Increased to 93.0 / 100',
                                                                        details: 'Tech debt reduction sprint remediated 14 critical CVEs across 5 repositories.',
                                                                        severity: 'INFO',
                                                                        repo: 'org-wide',
                                                                        time: '2 hours ago',
                                                },
                                                {
                                                                        type: 'Release',
                                                                        title: 'Production Release v3.2 Successful',
                                                                        details: 'Zero-downtime blue/green deployment completed in 4.2 minutes.',
                                                                        severity: 'INFO',
                                                                        repo: 'checkout-service',
                                                                        time: '1 day ago',
                                                },
                                                {
                                                                        type: 'Incident',
                                                                        title: 'INC-819: Redis Session Memory Pressure Warning',
                                                                        details: 'Memory usage spiked to 88%. Auto-scaling group triggered node expansion.',
                                                                        severity: 'WARNING',
                                                                        repo: 'auth-service-v1',
                                                                        time: '2 days ago',
                                                },
                                                {
                                                                        type: 'ArchEvolution',
                                                                        title: 'Architecture Shift: Monolith to Event-Driven Mesh',
                                                                        details: 'Phase 18 Autonomous Refactoring Engine migrated 3 modules to independent Go microservices.',
                                                                        severity: 'INFO',
                                                                        repo: 'legacy-monolith',
                                                                        time: '4 days ago',
                                                },
                        ];

                        const toolAdapters = [
                                                {
                                                                        name: 'GitHub',
                                                                        category: 'Source Control',
                                                                        icon: GitBranch,
                                                                        status: 'CONNECTED',
                                                },
                                                {
                                                                        name: 'GitLab',
                                                                        category: 'Enterprise SCM',
                                                                        icon: Layers,
                                                                        status: 'CONNECTED',
                                                },
                                                {
                                                                        name: 'Jira',
                                                                        category: 'Project Management',
                                                                        icon: Kanban,
                                                                        status: 'CONNECTED',
                                                },
                                                {
                                                                        name: 'Slack',
                                                                        category: 'ChatOps',
                                                                        icon: MessageSquare,
                                                                        status: 'CONNECTED',
                                                },
                                                {
                                                                        name: 'Azure DevOps',
                                                                        category: 'Cloud Boards',
                                                                        icon: Cloud,
                                                                        status: 'CONNECTED',
                                                },
                                                {
                                                                        name: 'Kubernetes',
                                                                        category: 'Container Orchestration',
                                                                        icon: Server,
                                                                        status: 'CONNECTED',
                                                },
                                                {
                                                                        name: 'Datadog',
                                                                        category: 'Observability APM',
                                                                        icon: Activity,
                                                                        status: 'CONNECTED',
                                                },
                                                {
                                                                        name: 'Grafana',
                                                                        category: 'Metrics Dashboards',
                                                                        icon: BarChart2,
                                                                        status: 'CONNECTED',
                                                },
                                                {
                                                                        name: 'Prometheus',
                                                                        category: 'Telemetry Stream',
                                                                        icon: Cpu,
                                                                        status: 'CONNECTED',
                                                },
                        ];

                        const marketplacePlugins = [
                                                {
                                                                        name: 'snyk-security-analyzer',
                                                                        version: 'v2.4.0',
                                                                        desc: 'Scans dependencies for CVE vulnerabilities and licencing compliance.',
                                                                        author: 'CodeAtlas Team',
                                                },
                                                {
                                                                        name: 'datadog-telemetry-connector',
                                                                        version: 'v1.8.2',
                                                                        desc: 'Stream live APM p95 latency and RPM metrics into Knowledge Graph nodes.',
                                                                        author: 'SRE Guild',
                                                },
                                                {
                                                                        name: 'sonar-quality-gate-plugin',
                                                                        version: 'v3.1.0',
                                                                        desc: 'Enforces SonarQube quality gate thresholds before PR merge approval.',
                                                                        author: 'Quality Eng',
                                                },
                                                {
                                                                        name: 'custom-architecture-linter',
                                                                        version: 'v1.0.5',
                                                                        desc: 'Validates enterprise zero-trust mTLS annotations across Kubernetes manifests.',
                                                                        author: 'Enterprise Arch',
                                                },
                        ];

                        const all40Features = [
                                                '1. Unified Engineering Workspace',
                                                '2. Universal Search (9 Domains)',
                                                '3. Engineering Memory OS',
                                                '4. Enterprise Knowledge Graph',
                                                '5. Live Engineering Timeline',
                                                '6. AI Engineering Copilot',
                                                '7. AI CTO Command Center',
                                                '8. Multi-Agent AI Council',
                                                '9. Autonomous Engineering Pipeline',
                                                '10. Enterprise Portfolio Dashboard',
                                                '11. Digital Twin World',
                                                '12. Architecture Simulator',
                                                '13. Production Impact Simulator',
                                                '14. Organization Health Score',
                                                '15. Engineering KPI Center',
                                                '16. Release Intelligence',
                                                '17. AI Modernization Advisor',
                                                '18. Cloud Intelligence',
                                                '19. Security Intelligence',
                                                '20. Reliability Intelligence',
                                                '21. Cost Intelligence',
                                                '22. Team Intelligence',
                                                '23. Executive Command Center',
                                                '24. AI Report Generator',
                                                '25. Engineering Recommendation Engine',
                                                '26. Engineering Workflow Automation',
                                                '27. Enterprise Notification Center',
                                                '28. Repository Marketplace',
                                                '29. Engineering API Gateway',
                                                '30. Role-Based Dashboards (6 Roles)',
                                                '31. Engineering Analytics',
                                                '32. Cross-System Correlation',
                                                '33. AI Decision Archive',
                                                '34. Governance Center',
                                                '35. Engineering Scorecards',
                                                '36. Platform SDK',
                                                '37. Integration Hub (9 Tools)',
                                                '38. AI Learning Engine',
                                                '39. Global Engineering Dashboard',
                                                '40. CodeAtlas Operating System',
                        ];

                        const handleRunQuery = (queryText: string) => {
                                                setQueryInput(queryText);
                                                setIsQuerying(true);
                                                setTimeout(() => {
                                                                        let cat =
                                                                                                'Engineering Query';
                                                                        let head = `Synthesized answer for query: '${queryText}'`;
                                                                        let det = [
                                                                                                'Cross-referencing Knowledge Graph, Event Bus, and AI Memory.',
                                                                                                'Synthesizing Datadog APM, GitHub commits, Jira issues, and Snyk security scans.',
                                                                        ];
                                                                        let conf = '96.5%';

                                                                        const lower =
                                                                                                queryText.toLowerCase();
                                                                        if (
                                                                                                lower.includes(
                                                                                                                        'scalability risk'
                                                                                                )
                                                                        ) {
                                                                                                cat =
                                                                                                                        'Scalability Risk';
                                                                                                head =
                                                                                                                        'analytics-ingestion-worker is the #1 scalability risk.';
                                                                                                det =
                                                                                                                        [
                                                                                                                                                "Unindexed database query on 'events_raw' table creates bottleneck at > 15,000 RPM.",
                                                                                                                                                'Datadog APM metrics show CPU utilization spikes to 94% under load.',
                                                                                                                                                "Recommendation: Apply Redis L2 caching and add index on 'events_raw(timestamp, user_id)'.",
                                                                                                                        ];
                                                                                                conf =
                                                                                                                        '98.2%';
                                                                        } else if (
                                                                                                lower.includes(
                                                                                                                        'latency increase'
                                                                                                ) ||
                                                                                                lower.includes(
                                                                                                                        'release 3.2'
                                                                                                )
                                                                        ) {
                                                                                                cat =
                                                                                                                        'Performance Root Cause';
                                                                                                head =
                                                                                                                        'Latency increased +180ms due to synchronous third-party HTTP call in Release 3.2.';
                                                                                                det =
                                                                                                                        [
                                                                                                                                                "Release 3.2 commit 'b819f2a' introduced synchronous payment token verification call.",
                                                                                                                                                'SonarQube & Snyk identified missing timeout configuration on HTTP client.',
                                                                                                                                                'Recommendation: Wrap payment verification call in FastAPI BackgroundTasks worker.',
                                                                                                                        ];
                                                                                                conf =
                                                                                                                        '96.8%';
                                                                        } else if (
                                                                                                lower.includes(
                                                                                                                        'modernized first'
                                                                                                )
                                                                        ) {
                                                                                                cat =
                                                                                                                        'Modernization Priority';
                                                                                                head =
                                                                                                                        'legacy-payment-gateway should be modernized first (Rank #1).';
                                                                                                det =
                                                                                                                        [
                                                                                                                                                'Contains 3 CRITICAL CVEs (Snyk scan), 42% test coverage (Jenkins), and high tech debt score.',
                                                                                                                                                'High revenue coupling makes this repository the top priority for Sprint 1.',
                                                                                                                                                'Recommendation: Run Phase 18 Autonomous Security Patch Generator & Refactoring Engine.',
                                                                                                                        ];
                                                                                                conf =
                                                                                                                        '99.0%';
                                                                        } else if (
                                                                                                lower.includes(
                                                                                                                        'roi'
                                                                                                )
                                                                        ) {
                                                                                                cat =
                                                                                                                        'Engineering ROI';
                                                                                                head =
                                                                                                                        'CodeAtlas OS delivered $1.45M cost avoidance and 18,400 developer hours saved.';
                                                                                                det =
                                                                                                                        [
                                                                                                                                                'Automated debt reduction reduced sprint bug tickets by 28.5%.',
                                                                                                                                                'Pre-PR AI Code Review gates prevented 14 critical production regressions.',
                                                                                                                                                'ROI Ratio: 7.4x return on total engineering infrastructure investment.',
                                                                                                                        ];
                                                                                                conf =
                                                                                                                        '95.5%';
                                                                        } else if (
                                                                                                lower.includes(
                                                                                                                        '100 million'
                                                                                                ) ||
                                                                                                lower.includes(
                                                                                                                        '100m'
                                                                                                )
                                                                        ) {
                                                                                                cat =
                                                                                                                        'Capacity Planning';
                                                                                                head =
                                                                                                                        'Architecture supports up to 45M active users. Scaling to 100M requires 2 bottlenecks resolved.';
                                                                                                det =
                                                                                                                        [
                                                                                                                                                'Bottleneck 1: Database primary write node saturates IOPS at 60M users.',
                                                                                                                                                'Bottleneck 2: Session storage in Auth Vault requires multi-region Redis cluster.',
                                                                                                                                                'Recommendation: Execute Phase 18 Database Migration Engine for read-replica sharding.',
                                                                                                                        ];
                                                                                                conf =
                                                                                                                        '94.0%';
                                                                        } else if (
                                                                                                lower.includes(
                                                                                                                        'checkout'
                                                                                                ) ||
                                                                                                lower.includes(
                                                                                                                        'owns'
                                                                                                )
                                                                        ) {
                                                                                                cat =
                                                                                                                        'Ownership & Team Intelligence';
                                                                                                head =
                                                                                                                        'Payments & Billing Team owns the checkout workflow.';
                                                                                                det =
                                                                                                                        [
                                                                                                                                                'Primary Code Owner: solo.dev@corp.com (Jira & Confluence author).',
                                                                                                                                                'Bus Factor Warning: High single-maintainer concentration detected on checkout-service.',
                                                                                                                                                'Recommendation: Assign 2 co-maintainers from Core API & Gateway team.',
                                                                                                                        ];
                                                                                                conf =
                                                                                                                        '97.5%';
                                                                        } else if (
                                                                                                lower.includes(
                                                                                                                        'blocking'
                                                                                                ) ||
                                                                                                lower.includes(
                                                                                                                        'release'
                                                                                                )
                                                                        ) {
                                                                                                cat =
                                                                                                                        'Release Blockers';
                                                                                                head =
                                                                                                                        'Release v2026.04-RC2 is currently blocked by 1 unverified DB schema migration.';
                                                                                                det =
                                                                                                                        [
                                                                                                                                                'Jenkins build #481 succeeded, but Alembic database migration dry-run requires sign-off.',
                                                                                                                                                'Human Approval Gateway holds gate in state AWAITING_HUMAN_APPROVAL.',
                                                                                                                                                'Recommendation: Authorize migration in Human Approval Gateway console.',
                                                                                                                        ];
                                                                                                conf =
                                                                                                                        '98.9%';
                                                                        }

                                                                        setActiveQueryResult({
                                                                                                category: cat,
                                                                                                headline: head,
                                                                                                details: det,
                                                                                                confidence: conf,
                                                                                                subsystems: [
                                                                                                                        'Repository Intelligence',
                                                                                                                        'Digital Twin Engine',
                                                                                                                        'AI CTO Council',
                                                                                                                        'Autonomous Engineering',
                                                                                                                        'Enterprise Intelligence',
                                                                                                ],
                                                                        });
                                                                        setIsQuerying(false);
                                                }, 400);
                        };

                        const filteredSearchResults =
                                                searchDomain === 'All'
                                                                        ? universalSearchMock
                                                                        : universalSearchMock.filter(
                                                                                                  (
                                                                                                                          item
                                                                                                  ) =>
                                                                                                                          item.domain ===
                                                                                                                          searchDomain
                                                                          );

                        return (
                                                <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
                                                                        {/* CodeAtlas OS Header & System Tray */}
                                                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
                                                                                                <div>
                                                                                                                        <div className="flex items-center gap-3 mb-2">
                                                                                                                                                <div className="p-2.5 bg-cyan-600/20 border border-cyan-500/30 rounded-xl text-cyan-400">
                                                                                                                                                                        <Monitor className="w-8 h-8" />
                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                                        <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-md border border-cyan-500/20">
                                                                                                                                                                                                Phase
                                                                                                                                                                                                20
                                                                                                                                                                                                •
                                                                                                                                                                                                CodeAtlas
                                                                                                                                                                                                Operating
                                                                                                                                                                                                System
                                                                                                                                                                                                Kernel
                                                                                                                                                                                                v20.0.0
                                                                                                                                                                        </span>
                                                                                                                                                                        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
                                                                                                                                                                                                The
                                                                                                                                                                                                Operating
                                                                                                                                                                                                System
                                                                                                                                                                                                for
                                                                                                                                                                                                Software
                                                                                                                                                                                                Engineering
                                                                                                                                                                        </h1>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                        <p className="text-slate-400 text-sm max-w-3xl">
                                                                                                                                                Connecting
                                                                                                                                                GitHub,
                                                                                                                                                GitLab,
                                                                                                                                                Jira,
                                                                                                                                                Slack,
                                                                                                                                                Azure
                                                                                                                                                DevOps,
                                                                                                                                                Kubernetes,
                                                                                                                                                Datadog,
                                                                                                                                                Grafana,
                                                                                                                                                and
                                                                                                                                                Prometheus
                                                                                                                                                into
                                                                                                                                                one
                                                                                                                                                platform
                                                                                                                                                to
                                                                                                                                                understand
                                                                                                                                                software,
                                                                                                                                                simulate
                                                                                                                                                change,
                                                                                                                                                predict
                                                                                                                                                risk,
                                                                                                                                                plan
                                                                                                                                                architecture,
                                                                                                                                                improve
                                                                                                                                                engineering,
                                                                                                                                                govern
                                                                                                                                                standards,
                                                                                                                                                and
                                                                                                                                                execute
                                                                                                                                                modernization.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                {/* System Status Tray */}
                                                                                                <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                                                                                                                        <div className="text-center px-3 border-r border-slate-800">
                                                                                                                                                <span className="text-xs text-slate-400 font-medium block">
                                                                                                                                                                        OS
                                                                                                                                                                        Kernel
                                                                                                                                                                        Status
                                                                                                                                                </span>
                                                                                                                                                <span className="text-sm font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded mt-1 inline-block">
                                                                                                                                                                        ●
                                                                                                                                                                        OPERATIONAL
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <div className="text-center px-3 border-r border-slate-800">
                                                                                                                                                <span className="text-xs text-slate-400 font-medium block">
                                                                                                                                                                        Active
                                                                                                                                                                        Features
                                                                                                                                                </span>
                                                                                                                                                <span className="text-2xl font-bold text-white">
                                                                                                                                                                        40
                                                                                                                                                                        /
                                                                                                                                                                        40
                                                                                                                                                                        Ready
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <div className="text-center px-3">
                                                                                                                                                <span className="text-xs text-slate-400 font-medium block">
                                                                                                                                                                        Connected
                                                                                                                                                                        Tools
                                                                                                                                                </span>
                                                                                                                                                <span className="text-2xl font-bold text-cyan-400">
                                                                                                                                                                        9
                                                                                                                                                                        Integrations
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Main Tab Navigation */}
                                                                        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-8 overflow-x-auto">
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'copilot'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'copilot'
                                                                                                                                                                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                                                                                                                                                                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Sparkles className="w-4 h-4" />{' '}
                                                                                                                        AI
                                                                                                                        Engineering
                                                                                                                        Copilot
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'search'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'search'
                                                                                                                                                                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                                                                                                                                                                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Search className="w-4 h-4" />{' '}
                                                                                                                        Universal
                                                                                                                        Search
                                                                                                                        (9
                                                                                                                        Domains)
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'memory'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'memory'
                                                                                                                                                                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                                                                                                                                                                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Database className="w-4 h-4" />{' '}
                                                                                                                        Engineering
                                                                                                                        Memory
                                                                                                                        OS
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'timeline'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'timeline'
                                                                                                                                                                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                                                                                                                                                                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Clock className="w-4 h-4" />{' '}
                                                                                                                        Live
                                                                                                                        Engineering
                                                                                                                        Timeline
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'roles'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'roles'
                                                                                                                                                                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                                                                                                                                                                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <UserCheck className="w-4 h-4" />{' '}
                                                                                                                        Role-Based
                                                                                                                        Dashboards
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'integrations'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'integrations'
                                                                                                                                                                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                                                                                                                                                                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Server className="w-4 h-4" />{' '}
                                                                                                                        Integration
                                                                                                                        Hub
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'matrix'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'matrix'
                                                                                                                                                                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                                                                                                                                                                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Grid className="w-4 h-4" />{' '}
                                                                                                                        All
                                                                                                                        40
                                                                                                                        Features
                                                                                                                        Matrix
                                                                                                </button>
                                                                        </div>

                                                                        {/* TAB 1: AI ENGINEERING COPILOT */}
                                                                        {activeTab ===
                                                                                                'copilot' && (
                                                                                                <div>
                                                                                                                        <div className="mb-8 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl">
                                                                                                                                                <div className="flex items-center gap-2 mb-3">
                                                                                                                                                                        <Sparkles className="w-5 h-5 text-cyan-400" />
                                                                                                                                                                        <h2 className="text-base font-extrabold text-white">
                                                                                                                                                                                                Feature
                                                                                                                                                                                                6:
                                                                                                                                                                                                AI
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Copilot
                                                                                                                                                                                                &
                                                                                                                                                                                                Universal
                                                                                                                                                                                                Query
                                                                                                                                                                                                Engine
                                                                                                                                                                        </h2>
                                                                                                                                                </div>

                                                                                                                                                <div className="flex items-center gap-3 mb-4">
                                                                                                                                                                        <input
                                                                                                                                                                                                type="text"
                                                                                                                                                                                                value={
                                                                                                                                                                                                                        queryInput
                                                                                                                                                                                                }
                                                                                                                                                                                                onChange={(
                                                                                                                                                                                                                        e
                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                        setQueryInput(
                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                                                                        .value
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                placeholder="Ask any engineering question (e.g. 'Which service is our biggest scalability risk?')"
                                                                                                                                                                                                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none shadow-inner"
                                                                                                                                                                        />
                                                                                                                                                                        <button
                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                        handleRunQuery(
                                                                                                                                                                                                                                                queryInput
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                disabled={
                                                                                                                                                                                                                        isQuerying
                                                                                                                                                                                                }
                                                                                                                                                                                                className="bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold px-6 py-3 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-cyan-600/30"
                                                                                                                                                                        >
                                                                                                                                                                                                {isQuerying ? (
                                                                                                                                                                                                                        <>
                                                                                                                                                                                                                                                <RotateCw className="w-4 h-4 animate-spin" />{' '}
                                                                                                                                                                                                                                                Synthesizing...
                                                                                                                                                                                                                        </>
                                                                                                                                                                                                ) : (
                                                                                                                                                                                                                        <>
                                                                                                                                                                                                                                                <Search className="w-4 h-4" />{' '}
                                                                                                                                                                                                                                                Ask
                                                                                                                                                                                                                                                CodeAtlas
                                                                                                                                                                                                                                                OS
                                                                                                                                                                                                                        </>
                                                                                                                                                                                                )}
                                                                                                                                                                        </button>
                                                                                                                                                </div>

                                                                                                                                                <div className="flex flex-wrap items-center gap-2">
                                                                                                                                                                        <span className="text-xs font-semibold text-slate-400 mr-1">
                                                                                                                                                                                                Preset
                                                                                                                                                                                                Questions:
                                                                                                                                                                        </span>
                                                                                                                                                                        {presetQueries.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        q,
                                                                                                                                                                                                                        idx
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <button
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                                                                        handleRunQuery(
                                                                                                                                                                                                                                                                                                q
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="text-xs bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-all"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        q
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </button>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        {activeQueryResult && (
                                                                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                                                                                                                                                                        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                                                                                                                                                                                                <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                activeQueryResult.category
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                                                                                                                                                                                                                        Confidence:{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                activeQueryResult.confidence
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>

                                                                                                                                                                        <h3 className="text-xl font-extrabold text-white mb-3 flex items-center gap-2">
                                                                                                                                                                                                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                                                                                                                                                                                {
                                                                                                                                                                                                                        activeQueryResult.headline
                                                                                                                                                                                                }
                                                                                                                                                                        </h3>

                                                                                                                                                                        <div className="space-y-2 mb-4 text-sm text-slate-300">
                                                                                                                                                                                                {activeQueryResult.details.map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                detail: string,
                                                                                                                                                                                                                                                idx: number
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-start gap-2"
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                                                                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        detail
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                                                                                                                                                                                                <span>
                                                                                                                                                                                                                        Synthesized
                                                                                                                                                                                                                        across:{' '}
                                                                                                                                                                                                                        {activeQueryResult.subsystems.join(
                                                                                                                                                                                                                                                ' • '
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-cyan-400 font-semibold">
                                                                                                                                                                                                                        CodeAtlas
                                                                                                                                                                                                                        Knowledge
                                                                                                                                                                                                                        Graph
                                                                                                                                                                                                                        +
                                                                                                                                                                                                                        Event
                                                                                                                                                                                                                        Bus
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        )}
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 2: UNIVERSAL SEARCH (9 DOMAINS) */}
                                                                        {activeTab === 'search' && (
                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                                                                                                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                                                                                                                                <div>
                                                                                                                                                                        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                                                <Search className="w-5 h-5 text-cyan-400" />{' '}
                                                                                                                                                                                                Feature
                                                                                                                                                                                                2:
                                                                                                                                                                                                Universal
                                                                                                                                                                                                Search
                                                                                                                                                                                                across
                                                                                                                                                                                                9
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Domains
                                                                                                                                                                        </h2>
                                                                                                                                                                        <p className="text-slate-400 text-xs mt-0.5">
                                                                                                                                                                                                Search
                                                                                                                                                                                                Code,
                                                                                                                                                                                                ADRs,
                                                                                                                                                                                                APIs,
                                                                                                                                                                                                Documentation,
                                                                                                                                                                                                Incidents,
                                                                                                                                                                                                Pull
                                                                                                                                                                                                Requests,
                                                                                                                                                                                                Commits,
                                                                                                                                                                                                Architecture,
                                                                                                                                                                                                and
                                                                                                                                                                                                Metrics.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        {/* Domain Filter Pills */}
                                                                                                                        <div className="flex flex-wrap items-center gap-2 mb-6">
                                                                                                                                                {searchDomains.map(
                                                                                                                                                                        (
                                                                                                                                                                                                dom
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <button
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                dom
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                setSearchDomain(
                                                                                                                                                                                                                                                                        dom
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className={`text-xs px-3 py-1.5 rounded-lg border font-bold transition-all ${
                                                                                                                                                                                                                                                searchDomain ===
                                                                                                                                                                                                                                                dom
                                                                                                                                                                                                                                                                        ? 'bg-cyan-600 text-white border-cyan-500'
                                                                                                                                                                                                                                                                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                                                                                                                                                                                                                        }`}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                dom
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </button>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>

                                                                                                                        <div className="space-y-3">
                                                                                                                                                {filteredSearchResults.map(
                                                                                                                                                                        (
                                                                                                                                                                                                res,
                                                                                                                                                                                                idx
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="p-4 bg-slate-950 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all flex items-start justify-between"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <div>
                                                                                                                                                                                                                                                <div className="flex items-center gap-2 mb-1">
                                                                                                                                                                                                                                                                        <span className="text-[10px] font-extrabold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        res.domain
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <h3 className="font-bold text-white text-sm">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        res.title
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </h3>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <p className="text-slate-400 text-xs font-mono">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                res.snippet
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <a
                                                                                                                                                                                                                                                href={
                                                                                                                                                                                                                                                                        res.target
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="text-xs text-cyan-400 font-bold hover:underline shrink-0 ml-4"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                Open
                                                                                                                                                                                                                                                ➔
                                                                                                                                                                                                                        </a>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 3: ENGINEERING MEMORY OS */}
                                                                        {activeTab === 'memory' && (
                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                                                                                                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                                                                                                                                <div>
                                                                                                                                                                        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                                                <Database className="w-5 h-5 text-purple-400" />{' '}
                                                                                                                                                                                                Feature
                                                                                                                                                                                                3:
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Memory
                                                                                                                                                                                                OS
                                                                                                                                                                        </h2>
                                                                                                                                                                        <p className="text-slate-400 text-xs mt-0.5">
                                                                                                                                                                                                Persistent
                                                                                                                                                                                                long-term
                                                                                                                                                                                                memory
                                                                                                                                                                                                for
                                                                                                                                                                                                Decisions,
                                                                                                                                                                                                Incidents,
                                                                                                                                                                                                Reviews,
                                                                                                                                                                                                Architecture,
                                                                                                                                                                                                and
                                                                                                                                                                                                Lessons
                                                                                                                                                                                                Learned.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="grid grid-cols-1 gap-4">
                                                                                                                                                {engineeringMemories.map(
                                                                                                                                                                        (
                                                                                                                                                                                                mem,
                                                                                                                                                                                                idx
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="p-4 bg-slate-950 border border-slate-800 rounded-xl"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <div className="flex items-center justify-between mb-2">
                                                                                                                                                                                                                                                <span className="text-xs font-extrabold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded">
                                                                                                                                                                                                                                                                        Memory
                                                                                                                                                                                                                                                                        Type:{' '}
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                mem.type
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-xs text-slate-400">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                mem.date
                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                        •
                                                                                                                                                                                                                                                                        Author:{' '}
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                mem.role
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <h3 className="text-base font-bold text-white mb-1">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        mem.title
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </h3>
                                                                                                                                                                                                                        <p className="text-slate-300 text-sm">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        mem.content
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 4: LIVE ENGINEERING TIMELINE */}
                                                                        {activeTab ===
                                                                                                'timeline' && (
                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                                                                                                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                                                                                                                                <div>
                                                                                                                                                                        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                                                <Clock className="w-5 h-5 text-emerald-400" />{' '}
                                                                                                                                                                                                Feature
                                                                                                                                                                                                5:
                                                                                                                                                                                                Live
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Timeline
                                                                                                                                                                                                Event
                                                                                                                                                                                                Replay
                                                                                                                                                                        </h2>
                                                                                                                                                                        <p className="text-slate-400 text-xs mt-0.5">
                                                                                                                                                                                                Replay
                                                                                                                                                                                                Deployments,
                                                                                                                                                                                                Releases,
                                                                                                                                                                                                Incidents,
                                                                                                                                                                                                Architecture
                                                                                                                                                                                                evolution,
                                                                                                                                                                                                and
                                                                                                                                                                                                Health
                                                                                                                                                                                                changes
                                                                                                                                                                                                in
                                                                                                                                                                                                real-time.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="space-y-4">
                                                                                                                                                {timelineEvents.map(
                                                                                                                                                                        (
                                                                                                                                                                                                evt,
                                                                                                                                                                                                idx
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-4"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 shrink-0">
                                                                                                                                                                                                                                                <Play className="w-5 h-5" />
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="flex-1">
                                                                                                                                                                                                                                                <div className="flex items-center justify-between mb-1">
                                                                                                                                                                                                                                                                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        evt.type
                                                                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                                                                •{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        evt.repo
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <span className="text-xs text-slate-400">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        evt.time
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <h3 className="font-bold text-white text-sm mb-1">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                evt.title
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </h3>
                                                                                                                                                                                                                                                <p className="text-slate-300 text-xs">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                evt.details
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 5: ROLE-BASED DASHBOARDS */}
                                                                        {activeTab === 'roles' && (
                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                                                                                                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                                                                                                                                <div>
                                                                                                                                                                        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                                                <UserCheck className="w-5 h-5 text-indigo-400" />{' '}
                                                                                                                                                                                                Feature
                                                                                                                                                                                                30:
                                                                                                                                                                                                Role-Based
                                                                                                                                                                                                Dashboards
                                                                                                                                                                        </h2>
                                                                                                                                                                        <p className="text-slate-400 text-xs mt-0.5">
                                                                                                                                                                                                Select
                                                                                                                                                                                                a
                                                                                                                                                                                                role
                                                                                                                                                                                                to
                                                                                                                                                                                                adapt
                                                                                                                                                                                                the
                                                                                                                                                                                                CodeAtlas
                                                                                                                                                                                                OS
                                                                                                                                                                                                view
                                                                                                                                                                                                for
                                                                                                                                                                                                Developer,
                                                                                                                                                                                                Tech
                                                                                                                                                                                                Lead,
                                                                                                                                                                                                Architect,
                                                                                                                                                                                                SRE,
                                                                                                                                                                                                QA,
                                                                                                                                                                                                or
                                                                                                                                                                                                CTO.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        {/* Role Selector */}
                                                                                                                        <div className="flex items-center gap-2 mb-6">
                                                                                                                                                {Object.keys(
                                                                                                                                                                        roleDashboards
                                                                                                                                                ).map(
                                                                                                                                                                        (
                                                                                                                                                                                                r
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <button
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                r
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                setSelectedRole(
                                                                                                                                                                                                                                                                        r
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                                                                                                                                                                                                                                                selectedRole ===
                                                                                                                                                                                                                                                r
                                                                                                                                                                                                                                                                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                                                                                                                                                                                                                                                                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                                                                                                                                                                                                                        }`}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        Role:{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                r
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </button>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>

                                                                                                                        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl mb-6">
                                                                                                                                                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                                                                                                                                                                        Primary
                                                                                                                                                                        Role
                                                                                                                                                                        Focus
                                                                                                                                                </span>
                                                                                                                                                <p className="text-sm font-semibold text-white">
                                                                                                                                                                        {
                                                                                                                                                                                                roleDashboards[
                                                                                                                                                                                                                        selectedRole
                                                                                                                                                                                                ]
                                                                                                                                                                                                                        .primary_focus
                                                                                                                                                                        }
                                                                                                                                                </p>
                                                                                                                        </div>

                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                                                                                                {roleDashboards[
                                                                                                                                                                        selectedRole
                                                                                                                                                ].widgets.map(
                                                                                                                                                                        (
                                                                                                                                                                                                w: any,
                                                                                                                                                                                                idx: number
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="p-5 bg-slate-950 border border-slate-800 rounded-xl"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <span className="text-xs text-slate-400 font-bold block mb-2">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        w.title
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-xl font-extrabold text-white block mb-2">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        w.metric
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block">
                                                                                                                                                                                                                                                STATUS:{' '}
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        w.status
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 6: INTEGRATION HUB */}
                                                                        {activeTab ===
                                                                                                'integrations' && (
                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                                                                                                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                                                                                                                                <div>
                                                                                                                                                                        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                                                <Server className="w-5 h-5 text-purple-400" />{' '}
                                                                                                                                                                                                Feature
                                                                                                                                                                                                37:
                                                                                                                                                                                                Integration
                                                                                                                                                                                                Hub
                                                                                                                                                                                                (9
                                                                                                                                                                                                Connected
                                                                                                                                                                                                Adapters)
                                                                                                                                                                        </h2>
                                                                                                                                                                        <p className="text-slate-400 text-xs mt-0.5">
                                                                                                                                                                                                Integrates
                                                                                                                                                                                                GitHub,
                                                                                                                                                                                                GitLab,
                                                                                                                                                                                                Jira,
                                                                                                                                                                                                Slack,
                                                                                                                                                                                                Azure
                                                                                                                                                                                                DevOps,
                                                                                                                                                                                                Kubernetes,
                                                                                                                                                                                                Datadog,
                                                                                                                                                                                                Grafana,
                                                                                                                                                                                                and
                                                                                                                                                                                                Prometheus.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                                                                                                                                {toolAdapters.map(
                                                                                                                                                                        (
                                                                                                                                                                                                tool,
                                                                                                                                                                                                idx
                                                                                                                                                                        ) => {
                                                                                                                                                                                                const Icon =
                                                                                                                                                                                                                        tool.icon;
                                                                                                                                                                                                return (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div className="flex items-center justify-center p-3 bg-slate-900 border border-slate-800 rounded-xl text-cyan-400 mb-3 w-12 h-12 mx-auto">
                                                                                                                                                                                                                                                                        <Icon className="w-6 h-6" />
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <span className="font-bold text-white text-sm block">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                tool.name
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-xs text-slate-400 block mb-2">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                tool.category
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                tool.status
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                );
                                                                                                                                                                        }
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 7: ALL 40 FEATURES MATRIX */}
                                                                        {activeTab === 'matrix' && (
                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                                                                                                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                                                                                                                                <div>
                                                                                                                                                                        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                                                <Grid className="w-5 h-5 text-cyan-400" />{' '}
                                                                                                                                                                                                Feature
                                                                                                                                                                                                40:
                                                                                                                                                                                                CodeAtlas
                                                                                                                                                                                                Operating
                                                                                                                                                                                                System
                                                                                                                                                                                                Complete
                                                                                                                                                                                                Suite
                                                                                                                                                                                                (40
                                                                                                                                                                                                Features)
                                                                                                                                                                        </h2>
                                                                                                                                                                        <p className="text-slate-400 text-xs mt-0.5">
                                                                                                                                                                                                The
                                                                                                                                                                                                culmination
                                                                                                                                                                                                of
                                                                                                                                                                                                all
                                                                                                                                                                                                20
                                                                                                                                                                                                phases
                                                                                                                                                                                                into
                                                                                                                                                                                                a
                                                                                                                                                                                                single
                                                                                                                                                                                                software
                                                                                                                                                                                                engineering
                                                                                                                                                                                                operating
                                                                                                                                                                                                system.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                                                                                                                                {all40Features.map(
                                                                                                                                                                        (
                                                                                                                                                                                                feat,
                                                                                                                                                                                                idx
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center gap-2"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                                                                                                                                                                                                        <span className="text-xs font-bold text-slate-200">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        feat
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}
                                                </div>
                        );
}
