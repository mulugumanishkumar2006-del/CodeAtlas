'use client';

import React, { useState, useEffect } from 'react';
import {
                        Building2,
                        Users,
                        ShieldAlert,
                        Flame,
                        Brain,
                        Layers,
                        Sparkles,
                        Search,
                        RefreshCw,
                        TrendingUp,
                        AlertTriangle,
                        CheckCircle2,
                        BookOpen,
                        Target,
                        ArrowRight,
                        Zap,
                        Activity,
                        Cpu,
                        BarChart3,
                        Server,
                        DollarSign,
                        Briefcase,
                        Sliders,
                        ShieldCheck,
                        Award,
                        PieChart,
                        HelpCircle,
                        FolderGit2,
                        Code2,
                        UserCheck,
                        AlertCircle,
                        MapPin,
                        GitBranch,
                        Network,
                        Clock,
                        Compass,
                        FileCode,
                        Shield,
} from 'lucide-react';

interface OrgOverview {
                        id: string;
                        name: string;
                        slug: string;
                        description: string;
                        total_repositories: number;
                        total_teams: number;
                        total_engineers: number;
                        overall_health_score: number;
                        modernization_index: number;
                        bottleneck_risk_score: number;
                        knowledge_silo_risk: number;
                        strategic_goals: string[];
}

interface MaturityScore {
                        overall_score: number;
                        architecture_score: number;
                        devops_score: number;
                        security_score: number;
                        testing_score: number;
                        ai_adoption_score: number;
                        documentation_score: number;
                        reliability_score: number;
}

interface TeamIntel {
                        id: string;
                        name: string;
                        lead_name: string;
                        team_type: string;
                        headcount: number;
                        velocity_pts: number;
                        workload_score: number;
                        burnout_risk_score: number;
                        cognitive_load_score: number;
                        owned_repos_count: number;
                        open_prs_count: number;
                        tech_debt_contribution_pct: number;
                        key_members: string[];
                        owned_services: string[];
}

interface TeamDeepAnalytics {
                        id: string;
                        team_name: string;
                        collaboration_index: number;
                        review_latency_hours: number;
                        review_participation_rate: number;
                        onboarding_complexity_days: number;
                        capacity_utilization_pct: number;
                        documentation_velocity_score: number;
                        code_ownership_map: Record<string, string>;
                        skill_distribution: Record<string, number>;
                        cross_team_dependencies: Array<{
                                                dependent_team: string;
                                                interface: string;
                        }>;
}

interface RepoIntel {
                        id: string;
                        repository_id: string;
                        repository_name: string;
                        modernization_urgency: number;
                        maintenance_impossibility_index: number;
                        codebase_health_score: number;
                        code_churn_rate: number;
                        bus_factor: number;
                        duplicate_code_ratio: number;
                        complexity_tier: string;
                        primary_language: string;
                        assigned_team: string;
                        tech_stack: string[];
                        risk_factors: string[];
}

interface KnowledgeSilo {
                        id: string;
                        service_or_repo: string;
                        silo_risk_level: string;
                        silo_score: number;
                        bus_factor: number;
                        onboarding_friction_score: number;
                        documentation_coverage: number;
                        key_knowledge_holders: string[];
                        siloed_topics: string[];
                        mitigation_steps: string[];
}

interface BusinessCriticality {
                        id: string;
                        service_name: string;
                        revenue_impact_tier: string;
                        sla_tier: string;
                        business_criticality_score: number;
                        failure_blast_radius: number;
                        customer_dependency_count: number;
                        is_duplicate_work_risk: boolean;
                        duplicate_candidates: string[];
                        owning_team: string;
}

interface StrategicRecommendation {
                        id: string;
                        title: string;
                        target_entity: string;
                        action_type: string;
                        priority: string;
                        impact_score: number;
                        urgency_score: number;
                        summary: string;
                        justification?: string;
                        execution_steps: string[];
                        expected_roi: string;
}

export default function OrganizationIntelligencePage() {
                        const [activeTab, setActiveTab] = useState<
                                                | 'executive'
                                                | 'graph'
                                                | 'maturity'
                                                | 'team-deep'
                                                | 'repositories'
                                                | 'teams'
                                                | 'knowledge'
                                                | 'business'
                                                | 'strategy'
                        >('executive');

                        const [searchQuery, setSearchQuery] = useState('');
                        const [isScanning, setIsScanning] = useState(false);

                        const [org, setOrg] = useState<OrgOverview>({
                                                id: 'org-acme-01',
                                                name: 'Acme Global Engineering',
                                                slug: 'acme-global',
                                                description: 'Enterprise Engineering Organization analyzing 520 repositories & 48 engineering teams.',
                                                total_repositories: 520,
                                                total_teams: 48,
                                                total_engineers: 650,
                                                overall_health_score: 84.2,
                                                modernization_index: 71.5,
                                                bottleneck_risk_score: 31.0,
                                                knowledge_silo_risk: 42.0,
                                                strategic_goals: [
                                                                        'Migrate Legacy Monolith to Microservices',
                                                                        'Reduce Burnout in Core Infrastructure Team',
                                                                        'Eliminate Single-Person Knowledge Silos',
                                                                        'Automate Architectural Governance',
                                                ],
                        });

                        const [maturity, setMaturity] = useState<MaturityScore>({
                                                overall_score: 81.4,
                                                architecture_score: 84.0,
                                                devops_score: 88.5,
                                                security_score: 79.0,
                                                testing_score: 76.5,
                                                ai_adoption_score: 82.0,
                                                documentation_score: 74.0,
                                                reliability_score: 86.0,
                        });

                        const [deepTeams, setDeepTeams] = useState<TeamDeepAnalytics[]>([
                                                {
                                                                        id: 'td-1',
                                                                        team_name: 'Payments & Billing Core',
                                                                        collaboration_index: 88.0,
                                                                        review_latency_hours: 3.5,
                                                                        review_participation_rate: 94.0,
                                                                        onboarding_complexity_days: 18.0,
                                                                        capacity_utilization_pct: 92.5,
                                                                        documentation_velocity_score: 68.0,
                                                                        code_ownership_map: {
                                                                                                'legacy-billing-monolith': 'Sarah Connor',
                                                                                                'payment-gateway-v2': 'Alex Mercer',
                                                                        },
                                                                        skill_distribution: {
                                                                                                Java: 40,
                                                                                                Go: 30,
                                                                                                Spring: 20,
                                                                                                PostgreSQL: 10,
                                                                        },
                                                                        cross_team_dependencies: [
                                                                                                {
                                                                                                                        dependent_team: 'Frontend Experience',
                                                                                                                        interface: 'GraphQL API',
                                                                                                },
                                                                        ],
                                                },
                                                {
                                                                        id: 'td-2',
                                                                        team_name: 'Platform Infrastructure',
                                                                        collaboration_index: 82.0,
                                                                        review_latency_hours: 2.8,
                                                                        review_participation_rate: 96.0,
                                                                        onboarding_complexity_days: 12.0,
                                                                        capacity_utilization_pct: 88.0,
                                                                        documentation_velocity_score: 85.0,
                                                                        code_ownership_map: {
                                                                                                'k8s-ingress-mesh': 'David Miller',
                                                                                                'auth-identity-service': 'Klaus Vance',
                                                                        },
                                                                        skill_distribution: {
                                                                                                Go: 55,
                                                                                                Kubernetes: 25,
                                                                                                Terraform: 20,
                                                                        },
                                                                        cross_team_dependencies: [
                                                                                                {
                                                                                                                        dependent_team: 'Payments & Billing Core',
                                                                                                                        interface: 'mTLS Mesh',
                                                                                                },
                                                                        ],
                                                },
                        ]);

                        const [teams, setTeams] = useState<TeamIntel[]>([
                                                {
                                                                        id: 't-1',
                                                                        name: 'Payments & Billing Core',
                                                                        lead_name: 'Sarah Connor',
                                                                        team_type: 'Core Product',
                                                                        headcount: 12,
                                                                        velocity_pts: 68.0,
                                                                        workload_score: 92.5,
                                                                        burnout_risk_score: 85.0,
                                                                        cognitive_load_score: 88.0,
                                                                        owned_repos_count: 14,
                                                                        open_prs_count: 38,
                                                                        tech_debt_contribution_pct: 24.5,
                                                                        key_members: [
                                                                                                'Sarah Connor',
                                                                                                'Alex Mercer',
                                                                                                'Elena Rostova',
                                                                        ],
                                                                        owned_services: [
                                                                                                'payment-gateway-v2',
                                                                                                'billing-ledger',
                                                                                                'tax-calculator',
                                                                        ],
                                                },
                                                {
                                                                        id: 't-2',
                                                                        name: 'Platform Infrastructure',
                                                                        lead_name: 'David Miller',
                                                                        team_type: 'Platform & Cloud',
                                                                        headcount: 10,
                                                                        velocity_pts: 54.0,
                                                                        workload_score: 88.0,
                                                                        burnout_risk_score: 74.0,
                                                                        cognitive_load_score: 81.0,
                                                                        owned_repos_count: 22,
                                                                        open_prs_count: 29,
                                                                        tech_debt_contribution_pct: 19.0,
                                                                        key_members: [
                                                                                                'David Miller',
                                                                                                'Klaus Vance',
                                                                                                'Devon Lee',
                                                                        ],
                                                                        owned_services: [
                                                                                                'k8s-ingress-mesh',
                                                                                                'terraform-base-modules',
                                                                                                'auth-identity-service',
                                                                        ],
                                                },
                                                {
                                                                        id: 't-3',
                                                                        name: 'Frontend Experience',
                                                                        lead_name: 'Jessica Chen',
                                                                        team_type: 'Frontend Product',
                                                                        headcount: 15,
                                                                        velocity_pts: 82.0,
                                                                        workload_score: 64.0,
                                                                        burnout_risk_score: 38.0,
                                                                        cognitive_load_score: 52.0,
                                                                        owned_repos_count: 8,
                                                                        open_prs_count: 12,
                                                                        tech_debt_contribution_pct: 11.2,
                                                                        key_members: [
                                                                                                'Jessica Chen',
                                                                                                'Marcus Brody',
                                                                                                'Anita Roy',
                                                                        ],
                                                                        owned_services: [
                                                                                                'web-dashboard-next',
                                                                                                'mobile-app-shell',
                                                                                                'design-system-react',
                                                                        ],
                                                },
                                                {
                                                                        id: 't-4',
                                                                        name: 'AI & Analytics Engine',
                                                                        lead_name: 'Dr. Aris Thorne',
                                                                        team_type: 'AI/ML Engineering',
                                                                        headcount: 9,
                                                                        velocity_pts: 41.0,
                                                                        workload_score: 76.0,
                                                                        burnout_risk_score: 48.0,
                                                                        cognitive_load_score: 79.0,
                                                                        owned_repos_count: 18,
                                                                        open_prs_count: 21,
                                                                        tech_debt_contribution_pct: 14.8,
                                                                        key_members: [
                                                                                                'Dr. Aris Thorne',
                                                                                                'Lila Vance',
                                                                        ],
                                                                        owned_services: [
                                                                                                'ml-feature-store',
                                                                                                'vector-search-cluster',
                                                                                                'recommendation-pipeline',
                                                                        ],
                                                },
                        ]);

                        const [repos, setRepos] = useState<RepoIntel[]>([
                                                {
                                                                        id: 'r-1',
                                                                        repository_id: 'repo-legacy-billing-v1',
                                                                        repository_name: 'acme/legacy-billing-monolith',
                                                                        modernization_urgency: 94.0,
                                                                        maintenance_impossibility_index: 89.5,
                                                                        codebase_health_score: 38.0,
                                                                        code_churn_rate: 45.0,
                                                                        bus_factor: 1,
                                                                        duplicate_code_ratio: 31.0,
                                                                        complexity_tier: 'HIGH',
                                                                        primary_language: 'Java 8',
                                                                        assigned_team: 'Payments & Billing Core',
                                                                        tech_stack: [
                                                                                                'Java 8',
                                                                                                'Spring Boot 1.5',
                                                                                                'Oracle DB',
                                                                        ],
                                                                        risk_factors: [
                                                                                                'End-of-Life Stack',
                                                                                                'Single Contributor Dependency',
                                                                                                'Zero Integration Tests',
                                                                        ],
                                                },
                                                {
                                                                        id: 'r-2',
                                                                        repository_id: 'repo-auth-service',
                                                                        repository_name: 'acme/auth-identity-service',
                                                                        modernization_urgency: 72.0,
                                                                        maintenance_impossibility_index: 62.0,
                                                                        codebase_health_score: 68.0,
                                                                        code_churn_rate: 28.0,
                                                                        bus_factor: 2,
                                                                        duplicate_code_ratio: 14.0,
                                                                        complexity_tier: 'HIGH',
                                                                        primary_language: 'Go',
                                                                        assigned_team: 'Platform Infrastructure',
                                                                        tech_stack: [
                                                                                                'Go 1.21',
                                                                                                'OAuth2',
                                                                                                'Redis',
                                                                                                'PostgreSQL',
                                                                        ],
                                                                        risk_factors: [
                                                                                                'High SLA Risk',
                                                                                                'Complex Crypto Dependencies',
                                                                        ],
                                                },
                                                {
                                                                        id: 'r-3',
                                                                        repository_id: 'repo-web-dashboard',
                                                                        repository_name: 'acme/web-dashboard-next',
                                                                        modernization_urgency: 25.0,
                                                                        maintenance_impossibility_index: 18.0,
                                                                        codebase_health_score: 92.0,
                                                                        code_churn_rate: 15.0,
                                                                        bus_factor: 5,
                                                                        duplicate_code_ratio: 4.5,
                                                                        complexity_tier: 'LOW',
                                                                        primary_language: 'TypeScript',
                                                                        assigned_team: 'Frontend Experience',
                                                                        tech_stack: [
                                                                                                'TypeScript',
                                                                                                'Next.js 14',
                                                                                                'TailwindCSS',
                                                                        ],
                                                                        risk_factors: [
                                                                                                'Rapid UI churn',
                                                                        ],
                                                },
                                                {
                                                                        id: 'r-4',
                                                                        repository_id: 'repo-recommendation-engine',
                                                                        repository_name: 'acme/recommendation-pipeline',
                                                                        modernization_urgency: 58.0,
                                                                        maintenance_impossibility_index: 48.0,
                                                                        codebase_health_score: 75.0,
                                                                        code_churn_rate: 32.0,
                                                                        bus_factor: 1,
                                                                        duplicate_code_ratio: 18.0,
                                                                        complexity_tier: 'MEDIUM',
                                                                        primary_language: 'Python',
                                                                        assigned_team: 'AI & Analytics Engine',
                                                                        tech_stack: [
                                                                                                'Python 3.11',
                                                                                                'PyTorch',
                                                                                                'Kafka',
                                                                                                'Pinecone',
                                                                        ],
                                                                        risk_factors: [
                                                                                                'Single Knowledge Holder (Dr. Aris Thorne)',
                                                                        ],
                                                },
                        ]);

                        const [silos, setSilos] = useState<KnowledgeSilo[]>([
                                                {
                                                                        id: 'ks-1',
                                                                        service_or_repo: 'legacy-billing-monolith',
                                                                        silo_risk_level: 'CRITICAL',
                                                                        silo_score: 92.0,
                                                                        bus_factor: 1,
                                                                        onboarding_friction_score: 88.0,
                                                                        documentation_coverage: 22.0,
                                                                        key_knowledge_holders: [
                                                                                                'Sarah Connor',
                                                                        ],
                                                                        siloed_topics: [
                                                                                                'Custom Tax Engine Logic',
                                                                                                'Oracle Stored Procedures',
                                                                                                'PCI Compliance Handshakes',
                                                                        ],
                                                                        mitigation_steps: [
                                                                                                'Pair programming rotation',
                                                                                                'Automated Architecture Spec Extraction',
                                                                                                'ADR Documentation Drive',
                                                                        ],
                                                },
                                                {
                                                                        id: 'ks-2',
                                                                        service_or_repo: 'recommendation-pipeline',
                                                                        silo_risk_level: 'HIGH',
                                                                        silo_score: 78.0,
                                                                        bus_factor: 1,
                                                                        onboarding_friction_score: 72.0,
                                                                        documentation_coverage: 35.0,
                                                                        key_knowledge_holders: [
                                                                                                'Dr. Aris Thorne',
                                                                        ],
                                                                        siloed_topics: [
                                                                                                'Custom Feature Matrix Normalization',
                                                                                                'Vector Index Tuning',
                                                                        ],
                                                                        mitigation_steps: [
                                                                                                'Cross-train ML Engineer from Analytics',
                                                                                                'Codebase Knowledge Graph Indexing',
                                                                        ],
                                                },
                        ]);

                        const [businessCrits, setBusinessCrits] = useState<BusinessCriticality[]>([
                                                {
                                                                        id: 'bc-1',
                                                                        service_name: 'billing-ledger',
                                                                        revenue_impact_tier: 'CRITICAL',
                                                                        sla_tier: '99.999%',
                                                                        business_criticality_score: 98.0,
                                                                        failure_blast_radius: 95.0,
                                                                        customer_dependency_count: 45000,
                                                                        is_duplicate_work_risk: true,
                                                                        duplicate_candidates: [
                                                                                                'payment-ledger-v1',
                                                                                                'accounting-sync-worker',
                                                                        ],
                                                                        owning_team: 'Payments & Billing Core',
                                                },
                                                {
                                                                        id: 'bc-2',
                                                                        service_name: 'auth-identity-service',
                                                                        revenue_impact_tier: 'CRITICAL',
                                                                        sla_tier: '99.99%',
                                                                        business_criticality_score: 96.0,
                                                                        failure_blast_radius: 99.0,
                                                                        customer_dependency_count: 120000,
                                                                        is_duplicate_work_risk: false,
                                                                        duplicate_candidates: [],
                                                                        owning_team: 'Platform Infrastructure',
                                                },
                        ]);

                        const [recommendations, setRecommendations] = useState<
                                                StrategicRecommendation[]
                        >([
                                                {
                                                                        id: 'sr-1',
                                                                        title: 'Reallocate 3 Engineers from Frontend to Payments Team',
                                                                        target_entity: 'Payments & Billing Core',
                                                                        action_type: 'REALLOCATE_ENGINEERS',
                                                                        priority: 'CRITICAL',
                                                                        impact_score: 94.0,
                                                                        urgency_score: 90.0,
                                                                        summary: 'Payments team is experiencing 92.5% workload and 85% burnout risk while maintaining critical revenue services.',
                                                                        justification: 'Frontend Experience team has low workload (64%) and low burnout risk (38%). Reallocating 3 engineers will balance workload to <75%.',
                                                                        execution_steps: [
                                                                                                'Identify 3 senior React/Node engineers from Frontend team.',
                                                                                                'Initiate 2-week onboarding bootcamp for payment-gateway-v2.',
                                                                                                'Reassign billing-ledger sprint tickets.',
                                                                        ],
                                                                        expected_roi: '40% Reduction in PR Lead Time & 50% Lower Burnout Risk',
                                                },
                        ]);

                        useEffect(() => {
                                                async function fetchOIPData() {
                                                                        try {
                                                                                                const overviewRes =
                                                                                                                        await fetch(
                                                                                                                                                '/api/v1/oip/overview'
                                                                                                                        );
                                                                                                if (
                                                                                                                        overviewRes.ok
                                                                                                )
                                                                                                                        setOrg(
                                                                                                                                                await overviewRes.json()
                                                                                                                        );

                                                                                                const maturityRes =
                                                                                                                        await fetch(
                                                                                                                                                '/api/v1/oip/maturity-score'
                                                                                                                        );
                                                                                                if (
                                                                                                                        maturityRes.ok
                                                                                                )
                                                                                                                        setMaturity(
                                                                                                                                                await maturityRes.json()
                                                                                                                        );

                                                                                                const deepTeamsRes =
                                                                                                                        await fetch(
                                                                                                                                                '/api/v1/oip/team-deep-analytics'
                                                                                                                        );
                                                                                                if (
                                                                                                                        deepTeamsRes.ok
                                                                                                )
                                                                                                                        setDeepTeams(
                                                                                                                                                await deepTeamsRes.json()
                                                                                                                        );
                                                                        } catch (err) {
                                                                                                console.log(
                                                                                                                        'Backend API offline, using live fallback simulation.'
                                                                                                );
                                                                        }
                                                }
                                                fetchOIPData();
                        }, []);

                        const triggerOrgScan = async () => {
                                                setIsScanning(true);
                                                setTimeout(() => {
                                                                        setIsScanning(false);
                                                                        setOrg((prev) => ({
                                                                                                ...prev,
                                                                                                overall_health_score: Math.min(
                                                                                                                        100,
                                                                                                                        prev.overall_health_score +
                                                                                                                                                1.2
                                                                                                ),
                                                                                                bottleneck_risk_score: Math.max(
                                                                                                                        10,
                                                                                                                        prev.bottleneck_risk_score -
                                                                                                                                                2.5
                                                                                                ),
                                                                        }));
                                                }, 1800);
                        };

                        return (
                                                <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
                                                                        {/* Header Banner */}
                                                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 border-b border-slate-800 pb-6">
                                                                                                <div>
                                                                                                                        <div className="flex items-center gap-3 mb-2">
                                                                                                                                                <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-indigo-500/20">
                                                                                                                                                                        🚀
                                                                                                                                                                        Phase
                                                                                                                                                                        36
                                                                                                                                                                        —
                                                                                                                                                                        Organization
                                                                                                                                                                        Intelligence
                                                                                                                                                                        Platform
                                                                                                                                                                        (OIP)
                                                                                                                                                </span>
                                                                                                                                                <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                                                                                                                                                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                                                                                                                                                        20
                                                                                                                                                                        Enterprise
                                                                                                                                                                        Features
                                                                                                                                                                        Active
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                                                                                                                                                Engineering
                                                                                                                                                Business
                                                                                                                                                Intelligence
                                                                                                                        </h1>
                                                                                                                        <p className="text-slate-400 text-sm md:text-base max-w-3xl mt-1">
                                                                                                                                                Google
                                                                                                                                                Maps-style
                                                                                                                                                Org
                                                                                                                                                Graph,
                                                                                                                                                7-axis
                                                                                                                                                Maturity
                                                                                                                                                Score,
                                                                                                                                                Team
                                                                                                                                                Collaboration
                                                                                                                                                Graph,
                                                                                                                                                Skill
                                                                                                                                                Distribution,
                                                                                                                                                and
                                                                                                                                                Bus
                                                                                                                                                Factor
                                                                                                                                                analysis
                                                                                                                                                across
                                                                                                                                                520
                                                                                                                                                repos
                                                                                                                                                &amp;
                                                                                                                                                48
                                                                                                                                                teams.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                <div className="flex items-center gap-3">
                                                                                                                        <button
                                                                                                                                                onClick={
                                                                                                                                                                        triggerOrgScan
                                                                                                                                                }
                                                                                                                                                disabled={
                                                                                                                                                                        isScanning
                                                                                                                                                }
                                                                                                                                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
                                                                                                                        >
                                                                                                                                                <RefreshCw
                                                                                                                                                                        className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`}
                                                                                                                                                />
                                                                                                                                                {isScanning
                                                                                                                                                                        ? 'Scanning Org Architecture...'
                                                                                                                                                                        : 'Run Org Intelligence Scan'}
                                                                                                                        </button>
                                                                                                </div>
                                                                        </div>

                                                                        {/* KPI Summary Cards */}
                                                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-md">
                                                                                                                        <div className="text-slate-400 text-[11px]">
                                                                                                                                                Total
                                                                                                                                                Repos
                                                                                                                        </div>
                                                                                                                        <div className="text-xl font-bold text-white mt-0.5">
                                                                                                                                                {
                                                                                                                                                                        org.total_repositories
                                                                                                                                                }
                                                                                                                        </div>
                                                                                                </div>

                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-md">
                                                                                                                        <div className="text-slate-400 text-[11px]">
                                                                                                                                                Active
                                                                                                                                                Engineers
                                                                                                                        </div>
                                                                                                                        <div className="text-xl font-bold text-indigo-400 mt-0.5">
                                                                                                                                                {
                                                                                                                                                                        org.total_engineers
                                                                                                                                                }
                                                                                                                        </div>
                                                                                                </div>

                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-md">
                                                                                                                        <div className="text-slate-400 text-[11px]">
                                                                                                                                                Maturity
                                                                                                                                                Score
                                                                                                                        </div>
                                                                                                                        <div className="text-xl font-bold text-emerald-400 mt-0.5">
                                                                                                                                                {
                                                                                                                                                                        maturity.overall_score
                                                                                                                                                }{' '}
                                                                                                                                                /
                                                                                                                                                100
                                                                                                                        </div>
                                                                                                </div>

                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-md">
                                                                                                                        <div className="text-slate-400 text-[11px]">
                                                                                                                                                Overloaded
                                                                                                                                                Teams
                                                                                                                        </div>
                                                                                                                        <div className="text-xl font-bold text-amber-400 mt-0.5">
                                                                                                                                                2
                                                                                                                                                Teams
                                                                                                                        </div>
                                                                                                </div>

                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-md">
                                                                                                                        <div className="text-slate-400 text-[11px]">
                                                                                                                                                Knowledge
                                                                                                                                                Silos
                                                                                                                        </div>
                                                                                                                        <div className="text-xl font-bold text-purple-400 mt-0.5">
                                                                                                                                                2
                                                                                                                                                Critical
                                                                                                                        </div>
                                                                                                </div>

                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-md">
                                                                                                                        <div className="text-slate-400 text-[11px]">
                                                                                                                                                Review
                                                                                                                                                Latency
                                                                                                                        </div>
                                                                                                                        <div className="text-xl font-bold text-cyan-400 mt-0.5">
                                                                                                                                                3.2
                                                                                                                                                Hours
                                                                                                                        </div>
                                                                                                </div>

                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-md">
                                                                                                                        <div className="text-slate-400 text-[11px]">
                                                                                                                                                Build
                                                                                                                                                Health
                                                                                                                        </div>
                                                                                                                        <div className="text-xl font-bold text-emerald-400 mt-0.5">
                                                                                                                                                99.4%
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Navigation Tabs */}
                                                                        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4 mb-8">
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'executive'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                                                                                                                                activeTab ===
                                                                                                                                                'executive'
                                                                                                                                                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                                                                                                                                                        : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Building2 className="w-4 h-4" />
                                                                                                                        Executive
                                                                                                                        Dashboard
                                                                                                </button>

                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'graph'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                                                                                                                                activeTab ===
                                                                                                                                                'graph'
                                                                                                                                                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                                                                                                                                                        : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Network className="w-4 h-4" />
                                                                                                                        Org
                                                                                                                        Hierarchy
                                                                                                                        Graph
                                                                                                                        (Google
                                                                                                                        Maps)
                                                                                                </button>

                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'maturity'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                                                                                                                                activeTab ===
                                                                                                                                                'maturity'
                                                                                                                                                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                                                                                                                                                        : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Award className="w-4 h-4" />
                                                                                                                        Maturity
                                                                                                                        Scorecard
                                                                                                                        (0–100)
                                                                                                </button>

                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'team-deep'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                                                                                                                                activeTab ===
                                                                                                                                                'team-deep'
                                                                                                                                                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                                                                                                                                                        : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Users className="w-4 h-4" />
                                                                                                                        Team
                                                                                                                        Deep
                                                                                                                        Analytics
                                                                                                                        (Features
                                                                                                                        6–20)
                                                                                                </button>

                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'knowledge'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                                                                                                                                activeTab ===
                                                                                                                                                'knowledge'
                                                                                                                                                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                                                                                                                                                        : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Brain className="w-4 h-4" />
                                                                                                                        Knowledge
                                                                                                                        Intelligence
                                                                                                                        (Features
                                                                                                                        41–60)
                                                                                                </button>

                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'repositories'
                                                                                                                                                )
                                                                                                                        }

                                                                                                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                                                                                                                                activeTab ===
                                                                                                                                                'repositories'
                                                                                                                                                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                                                                                                                                                        : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <FolderGit2 className="w-4 h-4" />
                                                                                                                        Repository
                                                                                                                        Portfolio
                                                                                                </button>

                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'earth'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                                                                                                                                activeTab ===
                                                                                                                                                'earth'
                                                                                                                                                                        ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg shadow-cyan-600/30 font-bold ring-2 ring-cyan-400/50'
                                                                                                                                                                        : 'bg-slate-900/60 text-emerald-400 hover:bg-slate-800 hover:text-emerald-300'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Globe className="w-4 h-4 text-cyan-300" />
                                                                                                                        🌍
                                                                                                                        Engineering
                                                                                                                        Earth
                                                                                                                        (Signature
                                                                                                                        Feature
                                                                                                                        100)
                                                                                                                        ⭐
                                                                                                </button>

                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'ai-org'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                                                                                                                                activeTab ===
                                                                                                                                                'ai-org'
                                                                                                                                                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                                                                                                                                                        : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Bot className="w-4 h-4 text-purple-400" />
                                                                                                                        AI
                                                                                                                        Org
                                                                                                                        Intelligence
                                                                                                                        &amp;
                                                                                                                        Chat
                                                                                                                        (Features
                                                                                                                        81–99)
                                                                                                </button>

                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'strategy'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                                                                                                                                activeTab ===
                                                                                                                                                'strategy'
                                                                                                                                                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                                                                                                                                                        : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Target className="w-4 h-4" />
                                                                                                                        Strategy
                                                                                                                        Engine
                                                                                                </button>
                                                                        </div>

                                                                        {/* TAB: EXECUTIVE DASHBOARD (FEATURES 61–80 CTO COMMAND CENTER) */}
                                                                        {activeTab ===
                                                                                                'executive' && (
                                                                                                <div className="space-y-6">
                                                                                                                        {/* Executive AI Briefing Card */}
                                                                                                                        <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/30 rounded-2xl p-6 backdrop-blur-md">
                                                                                                                                                <div className="flex items-center justify-between mb-3">
                                                                                                                                                                        <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                                                                                                                                                                                                <Sparkles className="w-4 h-4 text-indigo-300" />
                                                                                                                                                                                                Executive
                                                                                                                                                                                                AI
                                                                                                                                                                                                Briefing
                                                                                                                                                                                                (Feature
                                                                                                                                                                                                80)
                                                                                                                                                                        </span>
                                                                                                                                                                        <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-0.5 rounded-full font-bold">
                                                                                                                                                                                                DORA
                                                                                                                                                                                                Tier:
                                                                                                                                                                                                ELITE
                                                                                                                                                                                                ⚡
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                                                                                                                                                                        &ldquo;Q3
                                                                                                                                                                        Executive
                                                                                                                                                                        Briefing:
                                                                                                                                                                        The
                                                                                                                                                                        organization
                                                                                                                                                                        maintains
                                                                                                                                                                        Elite
                                                                                                                                                                        DORA
                                                                                                                                                                        performance
                                                                                                                                                                        with
                                                                                                                                                                        14.2
                                                                                                                                                                        daily
                                                                                                                                                                        production
                                                                                                                                                                        releases
                                                                                                                                                                        and
                                                                                                                                                                        an
                                                                                                                                                                        average
                                                                                                                                                                        MTTR
                                                                                                                                                                        of
                                                                                                                                                                        1.1
                                                                                                                                                                        hours.
                                                                                                                                                                        Annual
                                                                                                                                                                        cost
                                                                                                                                                                        of
                                                                                                                                                                        technical
                                                                                                                                                                        debt
                                                                                                                                                                        is
                                                                                                                                                                        estimated
                                                                                                                                                                        at
                                                                                                                                                                        $4.2M,
                                                                                                                                                                        concentrated
                                                                                                                                                                        primarily
                                                                                                                                                                        in
                                                                                                                                                                        <code className="text-rose-300 bg-slate-950/80 px-1.5 py-0.5 rounded mx-1">
                                                                                                                                                                                                acme/legacy-billing-monolith
                                                                                                                                                                        </code>

                                                                                                                                                                        .
                                                                                                                                                                        Strategic
                                                                                                                                                                        modernization
                                                                                                                                                                        is
                                                                                                                                                                        68.5%
                                                                                                                                                                        complete
                                                                                                                                                                        with
                                                                                                                                                                        an
                                                                                                                                                                        expected
                                                                                                                                                                        AI
                                                                                                                                                                        productivity
                                                                                                                                                                        lift
                                                                                                                                                                        of
                                                                                                                                                                        +32%.&rdquo;
                                                                                                                                                </p>
                                                                                                                        </div>

                                                                                                                        {/* DORA Metrics & Financial Metrics Grid */}
                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
                                                                                                                                                                        <span className="text-slate-400 block text-[11px]">
                                                                                                                                                                                                Deployment
                                                                                                                                                                                                Frequency
                                                                                                                                                                        </span>
                                                                                                                                                                        <div className="text-2xl font-black text-emerald-400 mt-1">
                                                                                                                                                                                                14.2
                                                                                                                                                                                                /
                                                                                                                                                                                                day
                                                                                                                                                                        </div>
                                                                                                                                                                        <p className="text-[10px] text-slate-500 mt-1">
                                                                                                                                                                                                Elite
                                                                                                                                                                                                DORA
                                                                                                                                                                                                Velocity
                                                                                                                                                                        </p>
                                                                                                                                                </div>

                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
                                                                                                                                                                        <span className="text-slate-400 block text-[11px]">
                                                                                                                                                                                                Commit
                                                                                                                                                                                                Lead
                                                                                                                                                                                                Time
                                                                                                                                                                        </span>
                                                                                                                                                                        <div className="text-2xl font-black text-indigo-400 mt-1">
                                                                                                                                                                                                3.4
                                                                                                                                                                                                Hours
                                                                                                                                                                        </div>
                                                                                                                                                                        <p className="text-[10px] text-slate-500 mt-1">
                                                                                                                                                                                                Idea
                                                                                                                                                                                                to
                                                                                                                                                                                                Production
                                                                                                                                                                        </p>
                                                                                                                                                </div>

                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
                                                                                                                                                                        <span className="text-slate-400 block text-[11px]">
                                                                                                                                                                                                Cost
                                                                                                                                                                                                of
                                                                                                                                                                                                Tech
                                                                                                                                                                                                Debt
                                                                                                                                                                        </span>
                                                                                                                                                                        <div className="text-2xl font-black text-rose-400 mt-1">
                                                                                                                                                                                                $4.2M
                                                                                                                                                                                                /
                                                                                                                                                                                                yr
                                                                                                                                                                        </div>
                                                                                                                                                                        <p className="text-[10px] text-slate-500 mt-1">
                                                                                                                                                                                                Monolith
                                                                                                                                                                                                Drag
                                                                                                                                                                                                Valuation
                                                                                                                                                                        </p>
                                                                                                                                                </div>

                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
                                                                                                                                                                        <span className="text-slate-400 block text-[11px]">
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                ROI
                                                                                                                                                                        </span>
                                                                                                                                                                        <div className="text-2xl font-black text-purple-400 mt-1">
                                                                                                                                                                                                +280%
                                                                                                                                                                        </div>
                                                                                                                                                                        <p className="text-[10px] text-slate-500 mt-1">
                                                                                                                                                                                                Capital
                                                                                                                                                                                                Return
                                                                                                                                                                                                Ratio
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                                                                                                                <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
                                                                                                                                                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                                                                                                                                                                <Activity className="w-5 h-5 text-indigo-400" />
                                                                                                                                                                                                Global
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Overview
                                                                                                                                                                                                (CTO
                                                                                                                                                                                                &amp;
                                                                                                                                                                                                VP
                                                                                                                                                                                                Command
                                                                                                                                                                                                Center)
                                                                                                                                                                        </h3>

                                                                                                                                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-xs">
                                                                                                                                                                                                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                                                                                                                                                                                                                        <span className="text-xs text-slate-400">
                                                                                                                                                                                                                                                Innovation
                                                                                                                                                                                                                                                Index
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <div className="text-2xl font-bold text-indigo-400">
                                                                                                                                                                                                                                                88%
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                                                                                                                                                                                                                        <span className="text-xs text-slate-400">
                                                                                                                                                                                                                                                Change
                                                                                                                                                                                                                                                Failure
                                                                                                                                                                                                                                                Rate
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <div className="text-2xl font-bold text-emerald-400">
                                                                                                                                                                                                                                                2.1%
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                                                                                                                                                                                                                        <span className="text-xs text-slate-400">
                                                                                                                                                                                                                                                AI
                                                                                                                                                                                                                                                Code
                                                                                                                                                                                                                                                Adoption
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <div className="text-2xl font-bold text-purple-400">
                                                                                                                                                                                                                                                82%
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                                                                                                                                                                                                                        <span className="text-xs text-slate-400">
                                                                                                                                                                                                                                                MTTR
                                                                                                                                                                                                                                                Recovery
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <div className="text-2xl font-bold text-cyan-400">
                                                                                                                                                                                                                                                1.1
                                                                                                                                                                                                                                                Hours
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        <h4 className="text-sm font-semibold text-slate-300 mb-3">
                                                                                                                                                                                                Strategic
                                                                                                                                                                                                Priorities
                                                                                                                                                                        </h4>
                                                                                                                                                                        <div className="space-y-2">
                                                                                                                                                                                                {org.strategic_goals.map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                g,
                                                                                                                                                                                                                                                i
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                i
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className="flex items-center gap-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 text-xs text-slate-300"
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                                                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        g
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
                                                                                                                                                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                                                                                                                                                                <ShieldAlert className="w-5 h-5 text-rose-400" />
                                                                                                                                                                                                Critical
                                                                                                                                                                                                Bottleneck
                                                                                                                                                                                                Alerts
                                                                                                                                                                        </h3>

                                                                                                                                                                        <div className="space-y-3 text-xs">
                                                                                                                                                                                                <div className="p-3 bg-rose-950/40 border border-rose-800/50 rounded-xl">
                                                                                                                                                                                                                        <span className="font-bold text-rose-400 block mb-1">
                                                                                                                                                                                                                                                🔥
                                                                                                                                                                                                                                                Payments
                                                                                                                                                                                                                                                Team
                                                                                                                                                                                                                                                Burnout
                                                                                                                                                                                                                                                (85%)
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <p className="text-slate-300">
                                                                                                                                                                                                                                                12
                                                                                                                                                                                                                                                engineers
                                                                                                                                                                                                                                                managing
                                                                                                                                                                                                                                                14
                                                                                                                                                                                                                                                repos
                                                                                                                                                                                                                                                with
                                                                                                                                                                                                                                                38
                                                                                                                                                                                                                                                open
                                                                                                                                                                                                                                                PRs.
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div className="p-3 bg-amber-950/40 border border-amber-800/50 rounded-xl">
                                                                                                                                                                                                                        <span className="font-bold text-amber-400 block mb-1">
                                                                                                                                                                                                                                                👤
                                                                                                                                                                                                                                                Single
                                                                                                                                                                                                                                                Contributor
                                                                                                                                                                                                                                                Risk
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <p className="text-slate-300">
                                                                                                                                                                                                                                                Sarah
                                                                                                                                                                                                                                                Connor
                                                                                                                                                                                                                                                holds
                                                                                                                                                                                                                                                92%
                                                                                                                                                                                                                                                knowledge
                                                                                                                                                                                                                                                of
                                                                                                                                                                                                                                                legacy-billing-monolith.
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB: GOOGLE MAPS HIERARCHY GRAPH (FEATURE 4) */}
                                                                        {activeTab === 'graph' && (
                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
                                                                                                                        <div className="flex items-center justify-between mb-4">
                                                                                                                                                <div>
                                                                                                                                                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                                                                                                                                                                <Network className="w-5 h-5 text-indigo-400" />
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Organization
                                                                                                                                                                                                Graph
                                                                                                                                                                                                (Google
                                                                                                                                                                                                Maps
                                                                                                                                                                                                View)
                                                                                                                                                                        </h3>
                                                                                                                                                                        <p className="text-xs text-slate-400">
                                                                                                                                                                                                Interactive
                                                                                                                                                                                                8-Tier
                                                                                                                                                                                                Hierarchy:
                                                                                                                                                                                                Organization
                                                                                                                                                                                                &rarr;
                                                                                                                                                                                                Departments
                                                                                                                                                                                                &rarr;
                                                                                                                                                                                                Teams
                                                                                                                                                                                                &rarr;
                                                                                                                                                                                                Repositories
                                                                                                                                                                                                &rarr;
                                                                                                                                                                                                Services
                                                                                                                                                                                                &rarr;
                                                                                                                                                                                                Modules
                                                                                                                                                                                                &rarr;
                                                                                                                                                                                                Files
                                                                                                                                                                                                &rarr;
                                                                                                                                                                                                Functions
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                                                <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-3 py-1 rounded-full font-semibold">
                                                                                                                                                                        8
                                                                                                                                                                        Tiers
                                                                                                                                                                        Connected
                                                                                                                                                </span>
                                                                                                                        </div>

                                                                                                                        <div className="space-y-3 text-xs">
                                                                                                                                                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
                                                                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                                                                <Building2 className="w-6 h-6 text-indigo-400" />
                                                                                                                                                                                                <div>
                                                                                                                                                                                                                        <span className="font-bold text-white text-sm">
                                                                                                                                                                                                                                                Tier
                                                                                                                                                                                                                                                1:
                                                                                                                                                                                                                                                Acme
                                                                                                                                                                                                                                                Global
                                                                                                                                                                                                                                                Engineering
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <p className="text-[11px] text-slate-400">
                                                                                                                                                                                                                                                520
                                                                                                                                                                                                                                                Repositories
                                                                                                                                                                                                                                                •
                                                                                                                                                                                                                                                48
                                                                                                                                                                                                                                                Teams
                                                                                                                                                                                                                                                •
                                                                                                                                                                                                                                                650
                                                                                                                                                                                                                                                Engineers
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <span className="text-emerald-400 font-bold">
                                                                                                                                                                                                84.2
                                                                                                                                                                                                Health
                                                                                                                                                                        </span>
                                                                                                                                                </div>

                                                                                                                                                <div className="pl-6 space-y-2 border-l-2 border-slate-800 ml-4">
                                                                                                                                                                        <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between">
                                                                                                                                                                                                <div className="flex items-center gap-3">
                                                                                                                                                                                                                        <Briefcase className="w-5 h-5 text-purple-400" />
                                                                                                                                                                                                                        <div>
                                                                                                                                                                                                                                                <span className="font-bold text-white">
                                                                                                                                                                                                                                                                        Tier
                                                                                                                                                                                                                                                                        2:
                                                                                                                                                                                                                                                                        Department
                                                                                                                                                                                                                                                                        —
                                                                                                                                                                                                                                                                        Core
                                                                                                                                                                                                                                                                        Platform
                                                                                                                                                                                                                                                                        &amp;
                                                                                                                                                                                                                                                                        Infrastructure
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <p className="text-[10px] text-slate-400">
                                                                                                                                                                                                                                                                        Owns
                                                                                                                                                                                                                                                                        180
                                                                                                                                                                                                                                                                        Microservices
                                                                                                                                                                                                                                                                        &amp;
                                                                                                                                                                                                                                                                        Infrastructure
                                                                                                                                                                                                                                                                        Repos
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="pl-6 space-y-2 border-l-2 border-slate-800 ml-4">
                                                                                                                                                                                                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
                                                                                                                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                                                                                                                <Users className="w-4 h-4 text-amber-400" />
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        <span className="font-bold text-white">
                                                                                                                                                                                                                                                                                                Tier
                                                                                                                                                                                                                                                                                                3:
                                                                                                                                                                                                                                                                                                Team
                                                                                                                                                                                                                                                                                                —
                                                                                                                                                                                                                                                                                                Payments
                                                                                                                                                                                                                                                                                                &amp;
                                                                                                                                                                                                                                                                                                Billing
                                                                                                                                                                                                                                                                                                Core
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <p className="text-[10px] text-slate-400">
                                                                                                                                                                                                                                                                                                Lead:
                                                                                                                                                                                                                                                                                                Sarah
                                                                                                                                                                                                                                                                                                Connor
                                                                                                                                                                                                                                                                                                •
                                                                                                                                                                                                                                                                                                Headcount:
                                                                                                                                                                                                                                                                                                12
                                                                                                                                                                                                                                                                                                Engineers
                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <span className="text-rose-400 font-bold text-[11px]">
                                                                                                                                                                                                                                                Workload:
                                                                                                                                                                                                                                                92.5%
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div className="pl-6 space-y-2 border-l-2 border-slate-800 ml-4">
                                                                                                                                                                                                                        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
                                                                                                                                                                                                                                                <div className="flex items-center gap-3">
                                                                                                                                                                                                                                                                        <FolderGit2 className="w-4 h-4 text-indigo-400" />
                                                                                                                                                                                                                                                                        <div>
                                                                                                                                                                                                                                                                                                <span className="font-bold text-white">
                                                                                                                                                                                                                                                                                                                        Tier
                                                                                                                                                                                                                                                                                                                        4:
                                                                                                                                                                                                                                                                                                                        Repo
                                                                                                                                                                                                                                                                                                                        —
                                                                                                                                                                                                                                                                                                                        acme/legacy-billing-monolith
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <p className="text-[10px] text-slate-400">
                                                                                                                                                                                                                                                                                                                        Java
                                                                                                                                                                                                                                                                                                                        8
                                                                                                                                                                                                                                                                                                                        •
                                                                                                                                                                                                                                                                                                                        Urgency:
                                                                                                                                                                                                                                                                                                                        94%
                                                                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                        <div className="pl-6 space-y-2 border-l-2 border-slate-800 ml-4">
                                                                                                                                                                                                                                                <div className="p-2.5 bg-slate-950/40 border border-slate-800/60 rounded-xl flex items-center justify-between">
                                                                                                                                                                                                                                                                        <div className="flex items-center gap-2">
                                                                                                                                                                                                                                                                                                <Server className="w-3.5 h-3.5 text-emerald-400" />
                                                                                                                                                                                                                                                                                                <span className="font-semibold text-slate-200">
                                                                                                                                                                                                                                                                                                                        Tier
                                                                                                                                                                                                                                                                                                                        5:
                                                                                                                                                                                                                                                                                                                        Service
                                                                                                                                                                                                                                                                                                                        —
                                                                                                                                                                                                                                                                                                                        billing-ledger
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <span className="text-slate-400 text-[10px]">
                                                                                                                                                                                                                                                                                                Tier
                                                                                                                                                                                                                                                                                                6:
                                                                                                                                                                                                                                                                                                Module
                                                                                                                                                                                                                                                                                                —
                                                                                                                                                                                                                                                                                                tax-engine
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                                <div className="pl-6 text-[11px] text-slate-400 space-y-1">
                                                                                                                                                                                                                                                                        <div>
                                                                                                                                                                                                                                                                                                📁
                                                                                                                                                                                                                                                                                                Tier
                                                                                                                                                                                                                                                                                                7:
                                                                                                                                                                                                                                                                                                File
                                                                                                                                                                                                                                                                                                —{' '}
                                                                                                                                                                                                                                                                                                <code>
                                                                                                                                                                                                                                                                                                                        app/services/tax_calculator.py
                                                                                                                                                                                                                                                                                                </code>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <div className="pl-4">
                                                                                                                                                                                                                                                                                                ⚡
                                                                                                                                                                                                                                                                                                Tier
                                                                                                                                                                                                                                                                                                8:
                                                                                                                                                                                                                                                                                                Function
                                                                                                                                                                                                                                                                                                —{' '}
                                                                                                                                                                                                                                                                                                <code>
                                                                                                                                                                                                                                                                                                                        calculate_vat_rate(order_id)
                                                                                                                                                                                                                                                                                                </code>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB: MATURITY SCORECARD (FEATURE 5) */}
                                                                        {activeTab ===
                                                                                                'maturity' && (
                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
                                                                                                                        <div className="flex items-center justify-between mb-6">
                                                                                                                                                <div>
                                                                                                                                                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                                                                                                                                                                <Award className="w-5 h-5 text-emerald-400" />
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Maturity
                                                                                                                                                                                                Scorecard
                                                                                                                                                                                                (0–100)
                                                                                                                                                                        </h3>
                                                                                                                                                                        <p className="text-xs text-slate-400">
                                                                                                                                                                                                Comprehensive
                                                                                                                                                                                                score
                                                                                                                                                                                                evaluated
                                                                                                                                                                                                across
                                                                                                                                                                                                7
                                                                                                                                                                                                technical
                                                                                                                                                                                                dimensions.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                                                <div className="text-3xl font-extrabold text-emerald-400">
                                                                                                                                                                        {
                                                                                                                                                                                                maturity.overall_score
                                                                                                                                                                        }{' '}
                                                                                                                                                                        /
                                                                                                                                                                        100
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                                                                                                <div className="space-y-4">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <div className="flex justify-between text-xs mb-1">
                                                                                                                                                                                                                        <span className="text-slate-300 font-semibold">
                                                                                                                                                                                                                                                1.
                                                                                                                                                                                                                                                Architecture
                                                                                                                                                                                                                                                Governance
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-indigo-400 font-bold">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        maturity.architecture_score
                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                %
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                className="bg-indigo-400 h-full rounded-full"
                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                        width: `${maturity.architecture_score}%`,
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                        ></div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div>
                                                                                                                                                                                                <div className="flex justify-between text-xs mb-1">
                                                                                                                                                                                                                        <span className="text-slate-300 font-semibold">
                                                                                                                                                                                                                                                2.
                                                                                                                                                                                                                                                DevOps
                                                                                                                                                                                                                                                &amp;
                                                                                                                                                                                                                                                CI/CD
                                                                                                                                                                                                                                                Speed
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-emerald-400 font-bold">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        maturity.devops_score
                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                %
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                className="bg-emerald-400 h-full rounded-full"
                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                        width: `${maturity.devops_score}%`,
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                        ></div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div>
                                                                                                                                                                                                <div className="flex justify-between text-xs mb-1">
                                                                                                                                                                                                                        <span className="text-slate-300 font-semibold">
                                                                                                                                                                                                                                                3.
                                                                                                                                                                                                                                                Security
                                                                                                                                                                                                                                                &amp;
                                                                                                                                                                                                                                                Compliance
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-amber-400 font-bold">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        maturity.security_score
                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                %
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                className="bg-amber-400 h-full rounded-full"
                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                        width: `${maturity.security_score}%`,
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                        ></div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div>
                                                                                                                                                                                                <div className="flex justify-between text-xs mb-1">
                                                                                                                                                                                                                        <span className="text-slate-300 font-semibold">
                                                                                                                                                                                                                                                4.
                                                                                                                                                                                                                                                Test
                                                                                                                                                                                                                                                Coverage
                                                                                                                                                                                                                                                &amp;
                                                                                                                                                                                                                                                Automation
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-rose-400 font-bold">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        maturity.testing_score
                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                %
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                className="bg-rose-400 h-full rounded-full"
                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                        width: `${maturity.testing_score}%`,
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                        ></div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                <div className="space-y-4">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <div className="flex justify-between text-xs mb-1">
                                                                                                                                                                                                                        <span className="text-slate-300 font-semibold">
                                                                                                                                                                                                                                                5.
                                                                                                                                                                                                                                                AI
                                                                                                                                                                                                                                                &amp;
                                                                                                                                                                                                                                                LLM
                                                                                                                                                                                                                                                Adoption
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-purple-400 font-bold">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        maturity.ai_adoption_score
                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                %
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                className="bg-purple-400 h-full rounded-full"
                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                        width: `${maturity.ai_adoption_score}%`,
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                        ></div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div>
                                                                                                                                                                                                <div className="flex justify-between text-xs mb-1">
                                                                                                                                                                                                                        <span className="text-slate-300 font-semibold">
                                                                                                                                                                                                                                                6.
                                                                                                                                                                                                                                                Documentation
                                                                                                                                                                                                                                                Completeness
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-cyan-400 font-bold">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        maturity.documentation_score
                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                %
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                className="bg-cyan-400 h-full rounded-full"
                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                        width: `${maturity.documentation_score}%`,
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                        ></div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div>
                                                                                                                                                                                                <div className="flex justify-between text-xs mb-1">
                                                                                                                                                                                                                        <span className="text-slate-300 font-semibold">
                                                                                                                                                                                                                                                7.
                                                                                                                                                                                                                                                Production
                                                                                                                                                                                                                                                Reliability
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-emerald-400 font-bold">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        maturity.reliability_score
                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                %
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                className="bg-emerald-400 h-full rounded-full"
                                                                                                                                                                                                                                                style={{
                                                                                                                                                                                                                                                                        width: `${maturity.reliability_score}%`,
                                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                        ></div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB: TEAM DEEP ANALYTICS (FEATURES 6-20) */}
                                                                        {activeTab ===
                                                                                                'team-deep' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                                                                                                {deepTeams.map(
                                                                                                                                                                        (
                                                                                                                                                                                                t
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                t.id
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                                                                                                                                                                                                                                                <h4 className="text-base font-bold text-white">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                t.team_name
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </h4>
                                                                                                                                                                                                                                                <span className="text-xs bg-indigo-950 text-indigo-300 px-2.5 py-0.5 rounded-md border border-indigo-800">
                                                                                                                                                                                                                                                                        Review
                                                                                                                                                                                                                                                                        Latency:{' '}
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                t.review_latency_hours
                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                        h
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                        <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                                                                                                                                                                                                                                                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                                                                                                                                                                                                                                                                        <span className="text-slate-400 block text-[10px]">
                                                                                                                                                                                                                                                                                                Collaboration
                                                                                                                                                                                                                                                                                                Index
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <span className="font-bold text-emerald-400 text-sm">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        t.collaboration_index
                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                %
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                                                                                                                                                                                                                                                                        <span className="text-slate-400 block text-[10px]">
                                                                                                                                                                                                                                                                                                Review
                                                                                                                                                                                                                                                                                                Participation
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <span className="font-bold text-indigo-400 text-sm">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        t.review_participation_rate
                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                %
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                                                                                                                                                                                                                                                                        <span className="text-slate-400 block text-[10px]">
                                                                                                                                                                                                                                                                                                Onboarding
                                                                                                                                                                                                                                                                                                Complexity
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <span className="font-bold text-amber-400 text-sm">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        t.onboarding_complexity_days
                                                                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                                                                Days
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                                                                                                                                                                                                                                                                        <span className="text-slate-400 block text-[10px]">
                                                                                                                                                                                                                                                                                                Doc
                                                                                                                                                                                                                                                                                                Velocity
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <span className="font-bold text-purple-400 text-sm">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        t.documentation_velocity_score
                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                %
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                        <div className="border-t border-slate-800/80 pt-3 text-xs">
                                                                                                                                                                                                                                                <p className="font-semibold text-slate-300 mb-1">
                                                                                                                                                                                                                                                                        Code
                                                                                                                                                                                                                                                                        Ownership
                                                                                                                                                                                                                                                                        Map:
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                <div className="space-y-1 text-slate-400">
                                                                                                                                                                                                                                                                        {Object.entries(
                                                                                                                                                                                                                                                                                                t.code_ownership_map
                                                                                                                                                                                                                                                                        ).map(
                                                                                                                                                                                                                                                                                                ([
                                                                                                                                                                                                                                                                                                                        repo,
                                                                                                                                                                                                                                                                                                                        owner,
                                                                                                                                                                                                                                                                                                ]) => (
                                                                                                                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                                                                        repo
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                className="flex justify-between bg-slate-950/40 p-2 rounded"
                                                                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                                                                <code>
                                                                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                                                                repo
                                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                </code>
                                                                                                                                                                                                                                                                                                                                                <span className="text-indigo-300 font-medium">
                                                                                                                                                                                                                                                                                                                                                                        👤{' '}
                                                                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                                                                owner
                                                                                                                                                                                                                                                                                                                                                                        }
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
                                                                        )}

                                                                        {/* TAB: KNOWLEDGE INTELLIGENCE (FEATURES 41–60) */}
                                                                        {activeTab ===
                                                                                                'knowledge' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
                                                                                                                                                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                                                                                                                                                                                        <Brain className="w-5 h-5 text-purple-400" />
                                                                                                                                                                                                                        Knowledge
                                                                                                                                                                                                                        Intelligence
                                                                                                                                                                                                                        Platform
                                                                                                                                                                                                                        (Features
                                                                                                                                                                                                                        41–60)
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <p className="text-xs text-slate-400">
                                                                                                                                                                                                                        Organization
                                                                                                                                                                                                                        Knowledge
                                                                                                                                                                                                                        Graph
                                                                                                                                                                                                                        (1,450
                                                                                                                                                                                                                        nodes),
                                                                                                                                                                                                                        Expert
                                                                                                                                                                                                                        Discovery
                                                                                                                                                                                                                        by
                                                                                                                                                                                                                        Code
                                                                                                                                                                                                                        Ownership,
                                                                                                                                                                                                                        ADR
                                                                                                                                                                                                                        Lineage
                                                                                                                                                                                                                        &amp;
                                                                                                                                                                                                                        Auto-Generated
                                                                                                                                                                                                                        Glossary.
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                                        <span className="text-xs bg-purple-950 text-purple-300 border border-purple-800 px-3 py-1 rounded-full font-semibold">
                                                                                                                                                                                                Learning
                                                                                                                                                                                                Score:
                                                                                                                                                                                                84.0
                                                                                                                                                                                                /
                                                                                                                                                                                                100
                                                                                                                                                                        </span>
                                                                                                                                                </div>

                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 text-xs">
                                                                                                                                                                        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                                                                                                                                                                                                <span className="text-slate-400 block mb-1">
                                                                                                                                                                                                                        Knowledge
                                                                                                                                                                                                                        Concentration
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="font-bold text-rose-400 text-base">
                                                                                                                                                                                                                        68.0%
                                                                                                                                                                                                                        Risk
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <p className="text-[10px] text-slate-500 mt-1">
                                                                                                                                                                                                                        Gini
                                                                                                                                                                                                                        Index
                                                                                                                                                                                                                        on
                                                                                                                                                                                                                        Core
                                                                                                                                                                                                                        Payment
                                                                                                                                                                                                                        Modules
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                                                                                                                                                                                                <span className="text-slate-400 block mb-1">
                                                                                                                                                                                                                        Documentation
                                                                                                                                                                                                                        Coverage
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="font-bold text-emerald-400 text-base">
                                                                                                                                                                                                                        74.5%
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <p className="text-[10px] text-slate-500 mt-1">
                                                                                                                                                                                                                        Doc
                                                                                                                                                                                                                        Freshness
                                                                                                                                                                                                                        Score:
                                                                                                                                                                                                                        78%
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                                                                                                                                                                                                <span className="text-slate-400 block mb-1">
                                                                                                                                                                                                                        ADR
                                                                                                                                                                                                                        Decision
                                                                                                                                                                                                                        Coverage
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="font-bold text-indigo-400 text-base">
                                                                                                                                                                                                                        82.0%
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <p className="text-[10px] text-slate-500 mt-1">
                                                                                                                                                                                                                        Decision
                                                                                                                                                                                                                        Lineage
                                                                                                                                                                                                                        Tracked
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                                                                                                                                                                                                <span className="text-slate-400 block mb-1">
                                                                                                                                                                                                                        Onboarding
                                                                                                                                                                                                                        Difficulty
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="font-bold text-amber-400 text-base">
                                                                                                                                                                                                                        42.0
                                                                                                                                                                                                                        /
                                                                                                                                                                                                                        100
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <p className="text-[10px] text-slate-500 mt-1">
                                                                                                                                                                                                                        Estimated
                                                                                                                                                                                                                        14
                                                                                                                                                                                                                        Days
                                                                                                                                                                                                                        to
                                                                                                                                                                                                                        1st
                                                                                                                                                                                                                        Commit
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* Sub-grid for Experts & Glossary */}
                                                                                                                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                                                                                                                                                                        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                                                                                                                                                                                                <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                                                                                                                                                                                                                        <UserCheck className="w-4 h-4 text-indigo-400" />
                                                                                                                                                                                                                        Expert
                                                                                                                                                                                                                        Discovery
                                                                                                                                                                                                                        (By
                                                                                                                                                                                                                        Code
                                                                                                                                                                                                                        Ownership
                                                                                                                                                                                                                        Map)
                                                                                                                                                                                                </h4>
                                                                                                                                                                                                <div className="space-y-2">
                                                                                                                                                                                                                        <div className="flex justify-between items-center p-2.5 bg-slate-900/80 rounded-lg border border-slate-800/60">
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        <span className="font-bold text-slate-200">
                                                                                                                                                                                                                                                                                                acme/legacy-billing-monolith
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <p className="text-[10px] text-slate-400">
                                                                                                                                                                                                                                                                                                Oracle
                                                                                                                                                                                                                                                                                                DB
                                                                                                                                                                                                                                                                                                &amp;
                                                                                                                                                                                                                                                                                                Tax
                                                                                                                                                                                                                                                                                                Engine
                                                                                                                                                                                                                                                                                                Logic
                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <span className="text-purple-300 bg-purple-950 px-2.5 py-1 rounded font-semibold">
                                                                                                                                                                                                                                                                        👤
                                                                                                                                                                                                                                                                        Sarah
                                                                                                                                                                                                                                                                        Connor
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                        <div className="flex justify-between items-center p-2.5 bg-slate-900/80 rounded-lg border border-slate-800/60">
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        <span className="font-bold text-slate-200">
                                                                                                                                                                                                                                                                                                acme/auth-identity-service
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <p className="text-[10px] text-slate-400">
                                                                                                                                                                                                                                                                                                OAuth2
                                                                                                                                                                                                                                                                                                &amp;
                                                                                                                                                                                                                                                                                                mTLS
                                                                                                                                                                                                                                                                                                Certificates
                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <span className="text-purple-300 bg-purple-950 px-2.5 py-1 rounded font-semibold">
                                                                                                                                                                                                                                                                        👤
                                                                                                                                                                                                                                                                        Klaus
                                                                                                                                                                                                                                                                        Vance
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                        <div className="flex justify-between items-center p-2.5 bg-slate-900/80 rounded-lg border border-slate-800/60">
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        <span className="font-bold text-slate-200">
                                                                                                                                                                                                                                                                                                acme/recommendation-pipeline
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <p className="text-[10px] text-slate-400">
                                                                                                                                                                                                                                                                                                PyTorch
                                                                                                                                                                                                                                                                                                Vector
                                                                                                                                                                                                                                                                                                Normalization
                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <span className="text-purple-300 bg-purple-950 px-2.5 py-1 rounded font-semibold">
                                                                                                                                                                                                                                                                        👤
                                                                                                                                                                                                                                                                        Dr.
                                                                                                                                                                                                                                                                        Aris
                                                                                                                                                                                                                                                                        Thorne
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                                                                                                                                                                                                <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                                                                                                                                                                                                                        <BookOpen className="w-4 h-4 text-emerald-400" />
                                                                                                                                                                                                                        Auto-Generated
                                                                                                                                                                                                                        Engineering
                                                                                                                                                                                                                        Glossary
                                                                                                                                                                                                </h4>
                                                                                                                                                                                                <div className="space-y-2">
                                                                                                                                                                                                                        <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800/60">
                                                                                                                                                                                                                                                <span className="font-bold text-indigo-400">
                                                                                                                                                                                                                                                                        EDR
                                                                                                                                                                                                                                                                        (Engineering
                                                                                                                                                                                                                                                                        Decision
                                                                                                                                                                                                                                                                        Record)
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <p className="text-slate-300 text-[11px] mt-0.5">
                                                                                                                                                                                                                                                                        Formal
                                                                                                                                                                                                                                                                        architectural
                                                                                                                                                                                                                                                                        decision
                                                                                                                                                                                                                                                                        log
                                                                                                                                                                                                                                                                        capturing
                                                                                                                                                                                                                                                                        context,
                                                                                                                                                                                                                                                                        consequences,
                                                                                                                                                                                                                                                                        and
                                                                                                                                                                                                                                                                        trade-offs.
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                        <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800/60">
                                                                                                                                                                                                                                                <span className="font-bold text-indigo-400">
                                                                                                                                                                                                                                                                        Bus
                                                                                                                                                                                                                                                                        Factor
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <p className="text-slate-300 text-[11px] mt-0.5">
                                                                                                                                                                                                                                                                        Minimum
                                                                                                                                                                                                                                                                        number
                                                                                                                                                                                                                                                                        of
                                                                                                                                                                                                                                                                        key
                                                                                                                                                                                                                                                                        engineers
                                                                                                                                                                                                                                                                        required
                                                                                                                                                                                                                                                                        for
                                                                                                                                                                                                                                                                        a
                                                                                                                                                                                                                                                                        system
                                                                                                                                                                                                                                                                        to
                                                                                                                                                                                                                                                                        remain
                                                                                                                                                                                                                                                                        maintainable.
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                        <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800/60">
                                                                                                                                                                                                                                                <span className="font-bold text-indigo-400">
                                                                                                                                                                                                                                                                        Blast
                                                                                                                                                                                                                                                                        Radius
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <p className="text-slate-300 text-[11px] mt-0.5">
                                                                                                                                                                                                                                                                        Potential
                                                                                                                                                                                                                                                                        impact
                                                                                                                                                                                                                                                                        zone
                                                                                                                                                                                                                                                                        of
                                                                                                                                                                                                                                                                        a
                                                                                                                                                                                                                                                                        service
                                                                                                                                                                                                                                                                        failure
                                                                                                                                                                                                                                                                        across
                                                                                                                                                                                                                                                                        downstream
                                                                                                                                                                                                                                                                        dependency
                                                                                                                                                                                                                                                                        trees.
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB: REPOSITORY PORTFOLIO (FEATURES 21–40) */}
                                                                        {activeTab ===
                                                                                                'repositories' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
                                                                                                                                                <div className="flex items-center justify-between mb-4">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                                                                                                                                                                                        <FolderGit2 className="w-5 h-5 text-indigo-400" />
                                                                                                                                                                                                                        Repository
                                                                                                                                                                                                                        Portfolio
                                                                                                                                                                                                                        Intelligence
                                                                                                                                                                                                                        (Features
                                                                                                                                                                                                                        21–40)
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <p className="text-xs text-slate-400">
                                                                                                                                                                                                                        Tech
                                                                                                                                                                                                                        Debt
                                                                                                                                                                                                                        Leaderboard,
                                                                                                                                                                                                                        Build
                                                                                                                                                                                                                        Reliability,
                                                                                                                                                                                                                        Security
                                                                                                                                                                                                                        Posture,
                                                                                                                                                                                                                        Infrastructure
                                                                                                                                                                                                                        Inventory
                                                                                                                                                                                                                        &amp;
                                                                                                                                                                                                                        Lifecycle
                                                                                                                                                                                                                        Stages
                                                                                                                                                                                                                        across
                                                                                                                                                                                                                        520
                                                                                                                                                                                                                        repositories.
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                                        <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 rounded-full font-semibold">
                                                                                                                                                                                                Portfolio
                                                                                                                                                                                                Health:
                                                                                                                                                                                                82.5
                                                                                                                                                                                                /
                                                                                                                                                                                                100
                                                                                                                                                                        </span>
                                                                                                                                                </div>

                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-xs">
                                                                                                                                                                        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                                                                                                                                                                                                <span className="text-slate-400 block mb-1">
                                                                                                                                                                                                                        Tech
                                                                                                                                                                                                                        Debt
                                                                                                                                                                                                                        Leaderboard
                                                                                                                                                                                                                        #1
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="font-bold text-rose-400 text-sm">
                                                                                                                                                                                                                        acme/legacy-billing-monolith
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <p className="text-[10px] text-slate-500 mt-1">
                                                                                                                                                                                                                        Tech
                                                                                                                                                                                                                        Debt
                                                                                                                                                                                                                        Score:
                                                                                                                                                                                                                        92.5%
                                                                                                                                                                                                                        •
                                                                                                                                                                                                                        Java
                                                                                                                                                                                                                        8
                                                                                                                                                                                                                        Stack
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                                                                                                                                                                                                <span className="text-slate-400 block mb-1">
                                                                                                                                                                                                                        Modernization
                                                                                                                                                                                                                        Candidate
                                                                                                                                                                                                                        #1
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="font-bold text-amber-400 text-sm">
                                                                                                                                                                                                                        acme/legacy-billing-monolith
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <p className="text-[10px] text-slate-500 mt-1">
                                                                                                                                                                                                                        Candidate
                                                                                                                                                                                                                        Score:
                                                                                                                                                                                                                        96.0%
                                                                                                                                                                                                                        •
                                                                                                                                                                                                                        0
                                                                                                                                                                                                                        Tests
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                                                                                                                                                                                                <span className="text-slate-400 block mb-1">
                                                                                                                                                                                                                        Top
                                                                                                                                                                                                                        Build
                                                                                                                                                                                                                        Reliability
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="font-bold text-emerald-400 text-sm">
                                                                                                                                                                                                                        acme/web-dashboard-next
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <p className="text-[10px] text-slate-500 mt-1">
                                                                                                                                                                                                                        99.8%
                                                                                                                                                                                                                        CI
                                                                                                                                                                                                                        Pass
                                                                                                                                                                                                                        Rate
                                                                                                                                                                                                                        •
                                                                                                                                                                                                                        45
                                                                                                                                                                                                                        Releases/mo
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                <div className="overflow-x-auto">
                                                                                                                                                                        <table className="w-full text-left text-xs text-slate-300">
                                                                                                                                                                                                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                                                                                                                                                                                                                        <tr>
                                                                                                                                                                                                                                                <th className="p-3">
                                                                                                                                                                                                                                                                        Rank
                                                                                                                                                                                                                                                                        &amp;
                                                                                                                                                                                                                                                                        Repo
                                                                                                                                                                                                                                                </th>
                                                                                                                                                                                                                                                <th className="p-3">
                                                                                                                                                                                                                                                                        Lifecycle
                                                                                                                                                                                                                                                </th>
                                                                                                                                                                                                                                                <th className="p-3">
                                                                                                                                                                                                                                                                        Tech
                                                                                                                                                                                                                                                                        Debt
                                                                                                                                                                                                                                                </th>
                                                                                                                                                                                                                                                <th className="p-3">
                                                                                                                                                                                                                                                                        Build
                                                                                                                                                                                                                                                                        Reliability
                                                                                                                                                                                                                                                </th>
                                                                                                                                                                                                                                                <th className="p-3">
                                                                                                                                                                                                                                                                        Security
                                                                                                                                                                                                                                                                        Posture
                                                                                                                                                                                                                                                </th>
                                                                                                                                                                                                                                                <th className="p-3">
                                                                                                                                                                                                                                                                        Releases/Mo
                                                                                                                                                                                                                                                </th>
                                                                                                                                                                                                                                                <th className="p-3">
                                                                                                                                                                                                                                                                        Infrastructure
                                                                                                                                                                                                                                                </th>
                                                                                                                                                                                                                        </tr>
                                                                                                                                                                                                </thead>
                                                                                                                                                                                                <tbody className="divide-y divide-slate-800/60">
                                                                                                                                                                                                                        {repos.map(
                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                        r,
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                                                                        <tr
                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                        r.id
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                className="hover:bg-slate-800/40 transition-colors"
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                <td className="p-3 font-bold text-white">
                                                                                                                                                                                                                                                                                                                        <div className="flex items-center gap-2">
                                                                                                                                                                                                                                                                                                                                                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px]">
                                                                                                                                                                                                                                                                                                                                                                        #
                                                                                                                                                                                                                                                                                                                                                                        {idx +
                                                                                                                                                                                                                                                                                                                                                                                                1}
                                                                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                                                                r.repository_name
                                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                </td>
                                                                                                                                                                                                                                                                                                <td className="p-3">
                                                                                                                                                                                                                                                                                                                        <span
                                                                                                                                                                                                                                                                                                                                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                                                                                                                                                                                                                                                                                                                                                        r.modernization_urgency >
                                                                                                                                                                                                                                                                                                                                                                        80
                                                                                                                                                                                                                                                                                                                                                                                                ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                                                                                                                                                                                                                                                                                                                                                                                : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                                                                                                                                                                                                                                                                                                                                }`}
                                                                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                                                                {r.modernization_urgency >
                                                                                                                                                                                                                                                                                                                                                80
                                                                                                                                                                                                                                                                                                                                                                        ? 'LEGACY'
                                                                                                                                                                                                                                                                                                                                                                        : 'ACTIVE'}
                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                </td>
                                                                                                                                                                                                                                                                                                <td className="p-3 font-bold text-amber-400">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                r.modernization_urgency
                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                        %
                                                                                                                                                                                                                                                                                                </td>
                                                                                                                                                                                                                                                                                                <td className="p-3 font-bold text-emerald-400">
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                r.codebase_health_score
                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                        %
                                                                                                                                                                                                                                                                                                </td>
                                                                                                                                                                                                                                                                                                <td className="p-3 font-bold text-indigo-400">
                                                                                                                                                                                                                                                                                                                        92.0%
                                                                                                                                                                                                                                                                                                </td>
                                                                                                                                                                                                                                                                                                <td className="p-3 font-bold text-slate-200">
                                                                                                                                                                                                                                                                                                                        18
                                                                                                                                                                                                                                                                                                                        /
                                                                                                                                                                                                                                                                                                                        mo
                                                                                                                                                                                                                                                                                                </td>
                                                                                                                                                                                                                                                                                                <td className="p-3 text-[10px] text-slate-400">
                                                                                                                                                                                                                                                                                                                        {r.tech_stack
                                                                                                                                                                                                                                                                                                                                                .slice(
                                                                                                                                                                                                                                                                                                                                                                        0,
                                                                                                                                                                                                                                                                                                                                                                        2
                                                                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                                                                                                .join(
                                                                                                                                                                                                                                                                                                                                                                        ', '
                                                                                                                                                                                                                                                                                                                                                )}
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

                                                                        {/* TAB: 🌍 ENGINEERING EARTH (SIGNATURE FEATURE 100) */}
                                                                        {activeTab === 'earth' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
                                                                                                                                                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                                                                        <Globe className="w-5 h-5 text-cyan-400 animate-spin-slow" />
                                                                                                                                                                                                                        🌍
                                                                                                                                                                                                                        Engineering
                                                                                                                                                                                                                        Earth
                                                                                                                                                                                                                        —
                                                                                                                                                                                                                        Live
                                                                                                                                                                                                                        Organizational
                                                                                                                                                                                                                        Globe
                                                                                                                                                                                                                        (Signature
                                                                                                                                                                                                                        Feature
                                                                                                                                                                                                                        100)
                                                                                                                                                                                                                        ⭐
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <p className="text-xs text-slate-400">
                                                                                                                                                                                                                        Macro
                                                                                                                                                                                                                        organizational
                                                                                                                                                                                                                        view
                                                                                                                                                                                                                        zooming
                                                                                                                                                                                                                        from
                                                                                                                                                                                                                        520
                                                                                                                                                                                                                        repos
                                                                                                                                                                                                                        down
                                                                                                                                                                                                                        to
                                                                                                                                                                                                                        48
                                                                                                                                                                                                                        live
                                                                                                                                                                                                                        team
                                                                                                                                                                                                                        nodes.
                                                                                                                                                                                                                        Click
                                                                                                                                                                                                                        any
                                                                                                                                                                                                                        team
                                                                                                                                                                                                                        node
                                                                                                                                                                                                                        to
                                                                                                                                                                                                                        reveal
                                                                                                                                                                                                                        live
                                                                                                                                                                                                                        health,
                                                                                                                                                                                                                        tech
                                                                                                                                                                                                                        debt,
                                                                                                                                                                                                                        knowledge
                                                                                                                                                                                                                        risk
                                                                                                                                                                                                                        &amp;
                                                                                                                                                                                                                        telemetry.
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                                        <span className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-800 px-3 py-1 rounded-full font-bold">
                                                                                                                                                                                                48
                                                                                                                                                                                                Live
                                                                                                                                                                                                Team
                                                                                                                                                                                                Nodes
                                                                                                                                                                                                Connected
                                                                                                                                                                        </span>
                                                                                                                                                </div>

                                                                                                                                                {/* Earth Interactive Map Canvas */}
                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                                                                                                                                                        {[
                                                                                                                                                                                                {
                                                                                                                                                                                                                        name: 'Platform Infrastructure',
                                                                                                                                                                                                                        category: 'Platform',
                                                                                                                                                                                                                        status: 'OPTIMAL',
                                                                                                                                                                                                                        health: 96,
                                                                                                                                                                                                                        debt: 18,
                                                                                                                                                                                                                        risk: 'LOW',
                                                                                                                                                                                                                        engineers: 16,
                                                                                                                                                                                                                        repos: 42,
                                                                                                                                                                                                                        icon: '⚡',
                                                                                                                                                                                                },
                                                                                                                                                                                                {
                                                                                                                                                                                                                        name: 'Payments & Billing',
                                                                                                                                                                                                                        category: 'Core Banking',
                                                                                                                                                                                                                        status: 'WARNING',
                                                                                                                                                                                                                        health: 64,
                                                                                                                                                                                                                        debt: 92.5,
                                                                                                                                                                                                                        risk: 'CRITICAL',
                                                                                                                                                                                                                        engineers: 12,
                                                                                                                                                                                                                        repos: 18,
                                                                                                                                                                                                                        icon: '💳',
                                                                                                                                                                                                },
                                                                                                                                                                                                {
                                                                                                                                                                                                                        name: 'Order Fulfillment',
                                                                                                                                                                                                                        category: 'E-Commerce',
                                                                                                                                                                                                                        status: 'OPTIMAL',
                                                                                                                                                                                                                        health: 88,
                                                                                                                                                                                                                        debt: 28,
                                                                                                                                                                                                                        risk: 'LOW',
                                                                                                                                                                                                                        engineers: 14,
                                                                                                                                                                                                                        repos: 24,
                                                                                                                                                                                                                        icon: '📦',
                                                                                                                                                                                                },
                                                                                                                                                                                                {
                                                                                                                                                                                                                        name: 'Authentication & Identity',
                                                                                                                                                                                                                        category: 'Security',
                                                                                                                                                                                                                        status: 'OPTIMAL',
                                                                                                                                                                                                                        health: 92,
                                                                                                                                                                                                                        debt: 34,
                                                                                                                                                                                                                        risk: 'LOW',
                                                                                                                                                                                                                        engineers: 10,
                                                                                                                                                                                                                        repos: 12,
                                                                                                                                                                                                                        icon: '🔐',
                                                                                                                                                                                                },
                                                                                                                                                                                                {
                                                                                                                                                                                                                        name: 'Data Platform & Analytics',
                                                                                                                                                                                                                        category: 'Big Data',
                                                                                                                                                                                                                        status: 'OPTIMAL',
                                                                                                                                                                                                                        health: 89,
                                                                                                                                                                                                                        debt: 24,
                                                                                                                                                                                                                        risk: 'MEDIUM',
                                                                                                                                                                                                                        engineers: 18,
                                                                                                                                                                                                                        repos: 36,
                                                                                                                                                                                                                        icon: '📊',
                                                                                                                                                                                                },
                                                                                                                                                                                                {
                                                                                                                                                                                                                        name: 'Mobile Engineering',
                                                                                                                                                                                                                        category: 'Frontend',
                                                                                                                                                                                                                        status: 'OPTIMAL',
                                                                                                                                                                                                                        health: 86,
                                                                                                                                                                                                                        debt: 32,
                                                                                                                                                                                                                        risk: 'LOW',
                                                                                                                                                                                                                        engineers: 22,
                                                                                                                                                                                                                        repos: 15,
                                                                                                                                                                                                                        icon: '📱',
                                                                                                                                                                                                },
                                                                                                                                                                                                {
                                                                                                                                                                                                                        name: 'AI & Intelligence',
                                                                                                                                                                                                                        category: 'AI/ML',
                                                                                                                                                                                                                        status: 'OPTIMAL',
                                                                                                                                                                                                                        health: 95,
                                                                                                                                                                                                                        debt: 14,
                                                                                                                                                                                                                        risk: 'LOW',
                                                                                                                                                                                                                        engineers: 25,
                                                                                                                                                                                                                        repos: 28,
                                                                                                                                                                                                                        icon: '🤖',
                                                                                                                                                                                                },
                                                                                                                                                                                                {
                                                                                                                                                                                                                        name: 'DevOps & SRE',
                                                                                                                                                                                                                        category: 'DevOps',
                                                                                                                                                                                                                        status: 'OPTIMAL',
                                                                                                                                                                                                                        health: 94,
                                                                                                                                                                                                                        debt: 15,
                                                                                                                                                                                                                        risk: 'LOW',
                                                                                                                                                                                                                        engineers: 15,
                                                                                                                                                                                                                        repos: 30,
                                                                                                                                                                                                                        icon: '🛠️',
                                                                                                                                                                                                },
                                                                                                                                                                                                {
                                                                                                                                                                                                                        name: 'InfoSec & Compliance',
                                                                                                                                                                                                                        category: 'Security',
                                                                                                                                                                                                                        status: 'OPTIMAL',
                                                                                                                                                                                                                        health: 96,
                                                                                                                                                                                                                        debt: 12,
                                                                                                                                                                                                                        risk: 'LOW',
                                                                                                                                                                                                                        engineers: 12,
                                                                                                                                                                                                                        repos: 20,
                                                                                                                                                                                                                        icon: '🛡️',
                                                                                                                                                                                                },
                                                                                                                                                                        ].map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        node,
                                                                                                                                                                                                                        i
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        i
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className={`p-4 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] ${
                                                                                                                                                                                                                                                                        node.status ===
                                                                                                                                                                                                                                                                        'WARNING'
                                                                                                                                                                                                                                                                                                ? 'bg-rose-950/40 border-rose-800/80 hover:border-rose-500 shadow-lg shadow-rose-950/50'
                                                                                                                                                                                                                                                                                                : 'bg-slate-950/60 border-slate-800/80 hover:border-cyan-500/60'
                                                                                                                                                                                                                                                }`}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <div className="flex items-center justify-between mb-2">
                                                                                                                                                                                                                                                                        <span className="text-sm font-bold text-white flex items-center gap-1.5">
                                                                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                node.icon
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        node.name
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <span
                                                                                                                                                                                                                                                                                                className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                                                                                                                                                                                                                                                                                                        node.status ===
                                                                                                                                                                                                                                                                                                                        'WARNING'
                                                                                                                                                                                                                                                                                                                                                ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                                                                                                                                                                                                                                                                                                                                : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                                                                                                                                                                                                                                                                                }`}
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        node.status
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                                <div className="grid grid-cols-2 gap-2 text-[11px] mt-3">
                                                                                                                                                                                                                                                                        <div className="bg-slate-900/80 p-2 rounded border border-slate-800/60">
                                                                                                                                                                                                                                                                                                <span className="text-slate-400 block text-[9px]">
                                                                                                                                                                                                                                                                                                                        Health
                                                                                                                                                                                                                                                                                                                        Index
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span
                                                                                                                                                                                                                                                                                                                        className={`font-bold ${node.health > 80 ? 'text-emerald-400' : 'text-amber-400'}`}
                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                node.health
                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                        %
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <div className="bg-slate-900/80 p-2 rounded border border-slate-800/60">
                                                                                                                                                                                                                                                                                                <span className="text-slate-400 block text-[9px]">
                                                                                                                                                                                                                                                                                                                        Tech
                                                                                                                                                                                                                                                                                                                        Debt
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span
                                                                                                                                                                                                                                                                                                                        className={`font-bold ${node.debt > 50 ? 'text-rose-400' : 'text-indigo-400'}`}
                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                node.debt
                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                        %
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                                <div className="mt-3 text-[10px] text-slate-400 flex justify-between pt-2 border-t border-slate-800/60">
                                                                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                                                                👥{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        node.engineers
                                                                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                                                                Engineers
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                                                                📁{' '}
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        node.repos
                                                                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                                                                Repos
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB: 🤖 AI ORG INTELLIGENCE & EXECUTIVE CHAT (FEATURES 81–99) */}
                                                                        {activeTab === 'ai-org' && (
                                                                                                <div className="space-y-6 text-xs">
                                                                                                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                                                                                                                <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
                                                                                                                                                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                                                                                                                                                                <Bot className="w-5 h-5 text-purple-400" />
                                                                                                                                                                                                AI
                                                                                                                                                                                                Organization
                                                                                                                                                                                                Advisor
                                                                                                                                                                                                &amp;
                                                                                                                                                                                                Executive
                                                                                                                                                                                                Assistant
                                                                                                                                                                                                (Features
                                                                                                                                                                                                81–99)
                                                                                                                                                                        </h3>

                                                                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                                                                                                                                                                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                                                                                                                                                                                                                        <h4 className="font-bold text-indigo-400 text-sm mb-2">
                                                                                                                                                                                                                                                🎯
                                                                                                                                                                                                                                                AI
                                                                                                                                                                                                                                                CTO
                                                                                                                                                                                                                                                Assistant
                                                                                                                                                                                                                                                Insights
                                                                                                                                                                                                                        </h4>
                                                                                                                                                                                                                        <p className="text-slate-300">
                                                                                                                                                                                                                                                Quarterly
                                                                                                                                                                                                                                                Focus:
                                                                                                                                                                                                                                                Decommission
                                                                                                                                                                                                                                                Legacy
                                                                                                                                                                                                                                                Billing
                                                                                                                                                                                                                                                &amp;
                                                                                                                                                                                                                                                Scale
                                                                                                                                                                                                                                                Vector
                                                                                                                                                                                                                                                Search
                                                                                                                                                                                                                                                Indexing.
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                        <div className="mt-2 text-emerald-400 font-semibold">
                                                                                                                                                                                                                                                Recommended
                                                                                                                                                                                                                                                Capital
                                                                                                                                                                                                                                                Allocation:
                                                                                                                                                                                                                                                $2.4M
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                                                                                                                                                                                                                        <h4 className="font-bold text-purple-400 text-sm mb-2">
                                                                                                                                                                                                                                                👔
                                                                                                                                                                                                                                                AI
                                                                                                                                                                                                                                                VP
                                                                                                                                                                                                                                                Engineering
                                                                                                                                                                                                                                                Insights
                                                                                                                                                                                                                        </h4>
                                                                                                                                                                                                                        <p className="text-slate-300">
                                                                                                                                                                                                                                                Sprint
                                                                                                                                                                                                                                                Health:
                                                                                                                                                                                                                                                96%
                                                                                                                                                                                                                                                of
                                                                                                                                                                                                                                                Sprint
                                                                                                                                                                                                                                                Commitments
                                                                                                                                                                                                                                                Met
                                                                                                                                                                                                                                                Across
                                                                                                                                                                                                                                                48
                                                                                                                                                                                                                                                Teams.
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                        <div className="mt-2 text-amber-400 font-semibold">
                                                                                                                                                                                                                                                Hiring
                                                                                                                                                                                                                                                Bottleneck:
                                                                                                                                                                                                                                                Senior
                                                                                                                                                                                                                                                Go
                                                                                                                                                                                                                                                Infra
                                                                                                                                                                                                                                                Engineers
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        <h4 className="font-bold text-white text-sm mb-3">
                                                                                                                                                                                                AI
                                                                                                                                                                                                Skill-Gap
                                                                                                                                                                                                Hiring
                                                                                                                                                                                                Recommendations
                                                                                                                                                                        </h4>
                                                                                                                                                                        <div className="space-y-2">
                                                                                                                                                                                                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex justify-between items-center">
                                                                                                                                                                                                                        <div>
                                                                                                                                                                                                                                                <span className="font-bold text-white">
                                                                                                                                                                                                                                                                        Staff
                                                                                                                                                                                                                                                                        Distributed
                                                                                                                                                                                                                                                                        Systems
                                                                                                                                                                                                                                                                        Engineer
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <p className="text-[10px] text-slate-400">
                                                                                                                                                                                                                                                                        Payments
                                                                                                                                                                                                                                                                        &amp;
                                                                                                                                                                                                                                                                        Billing
                                                                                                                                                                                                                                                                        Team
                                                                                                                                                                                                                                                                        •
                                                                                                                                                                                                                                                                        Single
                                                                                                                                                                                                                                                                        point
                                                                                                                                                                                                                                                                        of
                                                                                                                                                                                                                                                                        failure
                                                                                                                                                                                                                                                                        in
                                                                                                                                                                                                                                                                        Oracle
                                                                                                                                                                                                                                                                        Stored
                                                                                                                                                                                                                                                                        Procedures
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <span className="px-2.5 py-1 bg-rose-950 text-rose-400 border border-rose-800 rounded font-bold">
                                                                                                                                                                                                                                                CRITICAL
                                                                                                                                                                                                                                                NEED
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex justify-between items-center">
                                                                                                                                                                                                                        <div>
                                                                                                                                                                                                                                                <span className="font-bold text-white">
                                                                                                                                                                                                                                                                        Senior
                                                                                                                                                                                                                                                                        ML
                                                                                                                                                                                                                                                                        Ops
                                                                                                                                                                                                                                                                        Engineer
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <p className="text-[10px] text-slate-400">
                                                                                                                                                                                                                                                                        AI
                                                                                                                                                                                                                                                                        &amp;
                                                                                                                                                                                                                                                                        Intelligence
                                                                                                                                                                                                                                                                        Team
                                                                                                                                                                                                                                                                        •
                                                                                                                                                                                                                                                                        Scaling
                                                                                                                                                                                                                                                                        vector
                                                                                                                                                                                                                                                                        database
                                                                                                                                                                                                                                                                        query
                                                                                                                                                                                                                                                                        throughput
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <span className="px-2.5 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded font-bold">
                                                                                                                                                                                                                                                HIGH
                                                                                                                                                                                                                                                NEED
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* AI Executive Chat UI */}
                                                                                                                                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                                                                                                                                                                                        <MessageSquare className="w-5 h-5 text-indigo-400" />
                                                                                                                                                                                                                        Executive
                                                                                                                                                                                                                        AI
                                                                                                                                                                                                                        Chat
                                                                                                                                                                                                </h3>

                                                                                                                                                                                                <div className="space-y-3 mb-4 max-h-[320px] overflow-y-auto pr-1">
                                                                                                                                                                                                                        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-slate-300">
                                                                                                                                                                                                                                                <span className="text-[10px] font-bold text-indigo-400 block mb-1">
                                                                                                                                                                                                                                                                        CTO
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                What
                                                                                                                                                                                                                                                is
                                                                                                                                                                                                                                                our
                                                                                                                                                                                                                                                biggest
                                                                                                                                                                                                                                                architectural
                                                                                                                                                                                                                                                vulnerability
                                                                                                                                                                                                                                                right
                                                                                                                                                                                                                                                now?
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="bg-indigo-950/40 p-3 rounded-xl border border-indigo-800/60 text-slate-200">
                                                                                                                                                                                                                                                <span className="text-[10px] font-bold text-purple-400 block mb-1">
                                                                                                                                                                                                                                                                        CodeAtlas
                                                                                                                                                                                                                                                                        AI
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                The
                                                                                                                                                                                                                                                legacy
                                                                                                                                                                                                                                                billing
                                                                                                                                                                                                                                                monolith
                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                <code className="text-rose-300">
                                                                                                                                                                                                                                                                        acme/legacy-billing-monolith
                                                                                                                                                                                                                                                </code>

                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                represents
                                                                                                                                                                                                                                                92.5%
                                                                                                                                                                                                                                                of
                                                                                                                                                                                                                                                tech
                                                                                                                                                                                                                                                debt
                                                                                                                                                                                                                                                with
                                                                                                                                                                                                                                                a
                                                                                                                                                                                                                                                bus
                                                                                                                                                                                                                                                factor
                                                                                                                                                                                                                                                of
                                                                                                                                                                                                                                                1
                                                                                                                                                                                                                                                (Sarah
                                                                                                                                                                                                                                                Connor).
                                                                                                                                                                                                                                                Recommended
                                                                                                                                                                                                                                                action:
                                                                                                                                                                                                                                                Execute
                                                                                                                                                                                                                                                microservice
                                                                                                                                                                                                                                                refactoring.
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="flex gap-2">
                                                                                                                                                                                                <input
                                                                                                                                                                                                                        type="text"
                                                                                                                                                                                                                        placeholder="Ask CodeAtlas AI Executive Assistant..."
                                                                                                                                                                                                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                                                                                                                                                                                                />
                                                                                                                                                                                                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-semibold">
                                                                                                                                                                                                                        Send
                                                                                                                                                                                                </button>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB: STRATEGY ENGINE */}
                                                                        {activeTab ===
                                                                                                'strategy' && (
                                                                                                <div className="space-y-4">
                                                                                                                        {recommendations.map(
                                                                                                                                                (
                                                                                                                                                                        r
                                                                                                                                                ) => (
                                                                                                                                                                        <div
                                                                                                                                                                                                key={
                                                                                                                                                                                                                        r.id
                                                                                                                                                                                                }
                                                                                                                                                                                                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md"
                                                                                                                                                                        >
                                                                                                                                                                                                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                r.priority
                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                        PRIORITY
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <h4 className="text-lg font-bold text-white mt-2">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                r.title
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </h4>
                                                                                                                                                                                                <p className="text-xs text-slate-300 mt-1">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                r.summary
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </p>
                                                                                                                                                                                                <div className="mt-3 text-xs text-emerald-400 font-semibold">
                                                                                                                                                                                                                        ROI:{' '}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                r.expected_roi
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                )
                                                                                                                        )}
                                                                                                </div>
                                                                        )}
                                                </div>
                        );
}
