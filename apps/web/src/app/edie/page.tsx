'use client';

import React, { useState, useEffect } from 'react';
import {
                        Brain,
                        Search,
                        Sparkles,
                        GitBranch,
                        Clock,
                        ShieldCheck,
                        ShieldAlert,
                        FileText,
                        Lightbulb,
                        Plus,
                        Download,
                        Share2,
                        CheckCircle2,
                        AlertTriangle,
                        ArrowRight,
                        User,
                        Tag,
                        Zap,
                        Layers,
                        Activity,
                        Cpu,
                        RefreshCw,
                        BookOpen,
                        History,
                        Compass,
                        Code2,
                        AlertCircle,
                        HelpCircle,
                        Check,
                        Bot,
                        Scale,
                        DollarSign,
                        TrendingUp,
                        Award,
                        ListOrdered,
                        FileCode,
                        RotateCw,
                        Cloud,
                        Network,
                        Users,
                        Target,
                        Leaf,
                        Sliders,
                        Terminal,
                        Crown,
                        BarChart3,
                        Flame,
                        Shield,
                        Briefcase,
                        PieChart,
                        LightbulbOff,
                        Star,
                        CheckSquare,
} from 'lucide-react';

interface EngineeringDecision {
                        id: string;
                        repository_id: string;
                        title: string;
                        decision_type: string;
                        status: string;
                        context: string;
                        decision: string;
                        consequences: string;
                        alternatives_considered: string[];
                        sources: string[];
                        author: string;
                        tags: string[];
                        impact_score: number;
                        confidence_score: number;
                        health_status: string;
                        created_at: string;
}

interface ReasoningResult {
                        query: string;
                        answer: string;
                        decision_title?: string;
                        rationale: string;
                        historical_tradeoffs: string[];
                        evidence: Array<{
                                                source_type: string;
                                                reference: string;
                                                snippet?: string;
                        }>;
                        original_author?: string;
                        confidence_score: number;
}

interface GraphNode {
                        id: string;
                        label: string;
                        node_type: string;
                        properties: Record<string, any>;
}

interface GraphEdge {
                        id: string;
                        source_id: string;
                        target_id: string;
                        relation_type: string;
}

interface TimelineEvent {
                        id: string;
                        decision_id: string;
                        event_type: string;
                        description: string;
                        actor: string;
                        timestamp: string;
}

interface ValidationItem {
                        decision_id: string;
                        decision_title: string;
                        is_valid: boolean;
                        drift_status: string;
                        explanation: string;
                        violations_found: Array<{
                                                file_path: string;
                                                line_number?: number;
                                                violation_reason: string;
                                                suggested_fix?: string;
                        }>;
}

interface WikiData {
                        title: string;
                        markdown_content: string;
                        sections: string[];
                        total_decisions_indexed: number;
}

interface HistorianData {
                        narrative_title: string;
                        executive_summary: string;
                        historical_milestones: Array<{
                                                year: string;
                                                title: string;
                                                summary: string;
                        }>;
                        key_architects: string[];
}

interface PatternItem {
                        pattern_name: string;
                        category: string;
                        status: string;
                        introduced_in_decision: string;
                        file_locations_count: number;
}

interface LifecycleItem {
                        technology_name: string;
                        lifecycle_stage: string;
                        health_score: number;
                        replacement_technology?: string;
}

interface KnowledgeGapItem {
                        id: string;
                        gap_type: string;
                        title: string;
                        description: string;
                        severity: string;
                        affected_component: string;
                        suggested_action: string;
}

interface AIReasoningSuiteData {
                        decision_title: string;
                        alternative_solutions: Array<{
                                                name: string;
                                                description: string;
                                                pros: string[];
                                                cons: string[];
                                                fit_score: number;
                        }>;
                        tradeoff_analysis: Array<{
                                                dimension: string;
                                                chosen_option_score: number;
                                                alternative_option_score: number;
                                                analysis_notes: string;
                        }>;
                        debate_simulation: Array<{
                                                speaker: string;
                                                speaker_title: string;
                                                statement: string;
                                                recommendation: string;
                        }>;
                        future_predictions: string[];
                        staff_engineer_review: string;
                        cto_opinion: string;
                        principal_engineer_feedback: string;
                        solution_rankings: Array<{
                                                rank: number;
                                                solution_name: string;
                                                total_score: number;
                                                recommended: boolean;
                        }>;
                        risk_assessment: Record<string, any>;
                        cost_analysis: Record<string, any>;
                        scalability_review: Record<string, any>;
                        security_review: Record<string, any>;
                        maintainability_review: Record<string, any>;
                        performance_review: Record<string, any>;
                        architecture_advisor_notes: string;
                        tech_debt_advisor_notes: string;
                        modernization_advisor_notes: string;
                        migration_advisor_steps: string[];
                        generated_documentation: string;
                        executive_summary: string;
}

interface DecisionEvolutionSuiteData {
                        technology_replacements: Array<{
                                                feature_id: number;
                                                title: string;
                                                current_state: string;
                                                target_state: string;
                                                action_items: string[];
                        }>;
                        dependency_replacements: Array<{
                                                feature_id: number;
                                                title: string;
                                                current_state: string;
                                                target_state: string;
                                                action_items: string[];
                        }>;
                        deprecated_technology_alerts: Array<{
                                                technology: string;
                                                alert_level: string;
                                                sunset_date: string;
                                                affected_files: string[];
                        }>;
                        framework_upgrade_roadmap: Array<{
                                                framework: string;
                                                current: string;
                                                target: string;
                                                quarter: string;
                                                status: string;
                        }>;
                        database_evolution_plan: Array<{ phase: string; state: string }>;
                        cloud_migration_decisions: Array<{
                                                workload: string;
                                                provider: string;
                                                decision: string;
                        }>;
                        event_driven_adoption: Array<{
                                                domain: string;
                                                pattern: string;
                                                readiness_score: number;
                        }>;
                        api_version_strategy: Array<{
                                                version: string;
                                                status: string;
                                                sunset_q: string;
                        }>;
                        architecture_style_evolution: Array<{ era: string; style: string }>;
                        team_growth_recommendations: Array<{
                                                domain: string;
                                                current_size: string;
                                                recommended_size: string;
                        }>;
                        org_impact_analysis: Record<string, any>;
                        business_capability_mapping: Array<{
                                                capability: string;
                                                decision_title: string;
                        }>;
                        compliance_decision_tracking: Array<{
                                                standard: string;
                                                status: string;
                                                decision: string;
                        }>;
                        security_policy_evolution: Array<{ year: string; policy: string }>;
                        sustainability_decisions: Record<string, any>;
                        cost_optimization_timeline: Array<{
                                                milestone: string;
                                                savings_pct: number;
                                                date: string;
                        }>;
                        observability_roadmap: Array<{
                                                tool: string;
                                                purpose: string;
                                                status: string;
                        }>;
                        platform_engineering_plan: Array<{
                                                initiative: string;
                                                purpose: string;
                                                status: string;
                        }>;
                        developer_experience_evolution: Record<string, any>;
                        long_term_tech_strategy: Array<{ horizon: string; vision: string }>;
}

interface EngineeringBrainCard {
                        query: string;
                        decision_name: string;
                        reason: string;
                        chosen_by: string;
                        decision_date: string;
                        alternatives: string[];
                        tradeoffs: string[];
                        benefits: string[];
                        current_status: string;
                        confidence_score: number;
                        future_recommendation: string;
}

interface ExecutiveSuiteData {
                        engineering_brain: EngineeringBrainCard;
                        engineering_knowledge_score: number;
                        bus_factor_dashboard: Record<string, any>;
                        team_decision_heatmap: Array<{
                                                team: string;
                                                decisions_count: number;
                                                impact_avg: number;
                        }>;
                        strategic_decision_calendar: Array<{ quarter: string; event: string }>;
                        executive_architecture_reports: Array<{
                                                report_name: string;
                                                summary: string;
                        }>;
                        technology_investment_tracker: Record<string, any>;
                        engineering_kpi_dashboard: Record<string, any>;
                        innovation_score: number;
                        decision_risk_matrix: Record<string, any>;
                        tech_debt_investment_tracker: Record<string, any>;
                        architecture_governance_dashboard: Record<string, any>;
                        portfolio_insights: Array<{
                                                repository: string;
                                                health_grade: string;
                                                decisions_count: number;
                        }>;
                        cross_repo_decision_graph: Record<string, any>;
                        multi_team_alignment: Array<{
                                                initiative: string;
                                                participating_teams: string[];
                                                alignment_score: number;
                        }>;
                        ai_executive_assistant_notes: string;
                        global_engineering_memory: Record<string, any>;
                        architecture_audit_reports: Array<{
                                                audit_date: string;
                                                auditor: string;
                                                grade: string;
                        }>;
                        decision_simulation_history: Array<{
                                                simulation_id: string;
                                                scenario: string;
                                                result: string;
                        }>;
                        knowledge_retention_analytics: Record<string, any>;
}

export default function EDIEPage() {
                        const [activeTab, setActiveTab] = useState<
                                                | 'brain'
                                                | 'executive'
                                                | 'reasoning'
                                                | 'ai_suite'
                                                | 'evolution'
                                                | 'graph'
                                                | 'timeline'
                                                | 'validation'
                                                | 'wiki'
                                                | 'patterns'
                                                | 'gaps'
                                                | 'adr'
                        >('brain');
                        const [repoId] = useState('demo-codeatlas-repo');

                        // Brain Search State
                        const [brainInput, setBrainInput] = useState(
                                                'Why does this company use Kafka instead of RabbitMQ?'
                        );
                        const [isBrainQuerying, setIsBrainQuerying] = useState(false);
                        const [brainResult, setBrainResult] = useState<EngineeringBrainCard | null>(
                                                null
                        );

                        // Search / Reasoning State
                        const [queryInput, setQueryInput] = useState('');
                        const [isQuerying, setIsQuerying] = useState(false);
                        const [reasoningResult, setReasoningResult] =
                                                useState<ReasoningResult | null>(null);

                        // Data States
                        const [decisions, setDecisions] = useState<EngineeringDecision[]>([]);
                        const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
                        const [graphEdges, setGraphEdges] = useState<GraphEdge[]>([]);
                        const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
                        const [validations, setValidations] = useState<ValidationItem[]>([]);
                        const [wiki, setWiki] = useState<WikiData | null>(null);
                        const [historian, setHistorian] = useState<HistorianData | null>(null);
                        const [patterns, setPatterns] = useState<PatternItem[]>([]);
                        const [lifecycles, setLifecycles] = useState<LifecycleItem[]>([]);
                        const [gaps, setGaps] = useState<KnowledgeGapItem[]>([]);
                        const [aiSuite, setAISuite] = useState<AIReasoningSuiteData | null>(null);
                        const [evolutionSuite, setEvolutionSuite] =
                                                useState<DecisionEvolutionSuiteData | null>(null);
                        const [executiveSuite, setExecutiveSuite] =
                                                useState<ExecutiveSuiteData | null>(null);

                        // Export State
                        const [exportedADR, setExportedADR] = useState<{
                                                title: string;
                                                filename: string;
                                                madr_content: string;
                        } | null>(null);
                        const [selectedDecisionId, setSelectedDecisionId] = useState<string>('');

                        const promptPills = [
                                                'Why was Redis introduced?',
                                                'Why is Kafka used instead of RabbitMQ?',
                                                'Why did we split Payments into microservices?',
                                                'Why was this API deprecated?',
                                                'Why did we move to Kubernetes?',
                                                'Why are there three authentication systems?',
                        ];

                        useEffect(() => {
                                                fetchEDIEData();
                        }, [repoId]);

                        const fetchEDIEData = async () => {
                                                try {
                                                                        const decRes = await fetch(
                                                                                                `/api/v1/edie/decisions/${repoId}`
                                                                        ).catch(() => null);
                                                                        if (decRes && decRes.ok) {
                                                                                                const decData =
                                                                                                                        await decRes.json();
                                                                                                setDecisions(
                                                                                                                        decData
                                                                                                );
                                                                                                if (
                                                                                                                        decData.length >
                                                                                                                        0
                                                                                                )
                                                                                                                        setSelectedDecisionId(
                                                                                                                                                decData[0]
                                                                                                                                                                        .id
                                                                                                                        );
                                                                        } else {
                                                                                                setDecisions(
                                                                                                                        [
                                                                                                                                                {
                                                                                                                                                                        id: 'dec-1',
                                                                                                                                                                        repository_id: repoId,
                                                                                                                                                                        title: 'Adoption of Redis for Distributed Caching & Rate Limiting',
                                                                                                                                                                        decision_type: 'TECHNOLOGY',
                                                                                                                                                                        status: 'ACCEPTED',
                                                                                                                                                                        context: 'High-throughput API endpoints faced database latency spikes during traffic bursts.',
                                                                                                                                                                        decision: 'Introduce Redis as a centralized, low-latency in-memory data store.',
                                                                                                                                                                        consequences: 'Reduced DB query load by 68%. Sub-5ms API response times.',
                                                                                                                                                                        alternatives_considered: [
                                                                                                                                                                                                'Memcached (lacks pub/sub)',
                                                                                                                                                                                                'Local in-process cache',
                                                                                                                                                                        ],
                                                                                                                                                                        sources: [
                                                                                                                                                                                                'ADR-001',
                                                                                                                                                                                                'PR #142',
                                                                                                                                                                        ],
                                                                                                                                                                        author: 'Elena Vance (Principal Architect)',
                                                                                                                                                                        tags: [
                                                                                                                                                                                                'redis',
                                                                                                                                                                                                'caching',
                                                                                                                                                                                                'performance',
                                                                                                                                                                        ],
                                                                                                                                                                        impact_score: 92.0,
                                                                                                                                                                        confidence_score: 0.98,
                                                                                                                                                                        health_status: 'HEALTHY',
                                                                                                                                                                        created_at: new Date().toISOString(),
                                                                                                                                                },
                                                                                                                        ]
                                                                                                );
                                                                        }

                                                                        // Executive Suite & Signature Engineering Brain (Features 61-80)
                                                                        const execRes = await fetch(
                                                                                                `/api/v1/edie/executive-intelligence/${repoId}`
                                                                        ).catch(() => null);
                                                                        if (execRes && execRes.ok) {
                                                                                                const execData =
                                                                                                                        await execRes.json();
                                                                                                setExecutiveSuite(
                                                                                                                        execData
                                                                                                );
                                                                                                setBrainResult(
                                                                                                                        execData.engineering_brain
                                                                                                );
                                                                        }

                                                                        const aiRes = await fetch(
                                                                                                `/api/v1/edie/ai-reasoning/${repoId}`
                                                                        ).catch(() => null);
                                                                        if (aiRes && aiRes.ok)
                                                                                                setAISuite(
                                                                                                                        await aiRes.json()
                                                                                                );

                                                                        const evoRes = await fetch(
                                                                                                `/api/v1/edie/decision-evolution/${repoId}`
                                                                        ).catch(() => null);
                                                                        if (evoRes && evoRes.ok)
                                                                                                setEvolutionSuite(
                                                                                                                        await evoRes.json()
                                                                                                );

                                                                        const gRes = await fetch(
                                                                                                `/api/v1/edie/graph/${repoId}`
                                                                        ).catch(() => null);
                                                                        if (gRes && gRes.ok) {
                                                                                                const gData =
                                                                                                                        await gRes.json();
                                                                                                setGraphNodes(
                                                                                                                        gData.nodes ||
                                                                                                                                                []
                                                                                                );
                                                                                                setGraphEdges(
                                                                                                                        gData.edges ||
                                                                                                                                                []
                                                                                                );
                                                                        }

                                                                        const tRes = await fetch(
                                                                                                `/api/v1/edie/timeline/${repoId}`
                                                                        ).catch(() => null);
                                                                        if (tRes && tRes.ok)
                                                                                                setTimelineEvents(
                                                                                                                        await tRes.json()
                                                                                                );

                                                                        const vRes = await fetch(
                                                                                                `/api/v1/edie/validate/${repoId}`
                                                                        ).catch(() => null);
                                                                        if (vRes && vRes.ok)
                                                                                                setValidations(
                                                                                                                        await vRes.json()
                                                                                                );

                                                                        const wRes = await fetch(
                                                                                                `/api/v1/edie/wiki/${repoId}`
                                                                        ).catch(() => null);
                                                                        if (wRes && wRes.ok)
                                                                                                setWiki(
                                                                                                                        await wRes.json()
                                                                                                );

                                                                        const hRes = await fetch(
                                                                                                `/api/v1/edie/historian/${repoId}`
                                                                        ).catch(() => null);
                                                                        if (hRes && hRes.ok)
                                                                                                setHistorian(
                                                                                                                        await hRes.json()
                                                                                                );

                                                                        const pRes = await fetch(
                                                                                                `/api/v1/edie/design-patterns/${repoId}`
                                                                        ).catch(() => null);
                                                                        if (pRes && pRes.ok)
                                                                                                setPatterns(
                                                                                                                        await pRes.json()
                                                                                                );

                                                                        const lRes = await fetch(
                                                                                                `/api/v1/edie/tech-lifecycle/${repoId}`
                                                                        ).catch(() => null);
                                                                        if (lRes && lRes.ok)
                                                                                                setLifecycles(
                                                                                                                        await lRes.json()
                                                                                                );

                                                                        const kRes = await fetch(
                                                                                                `/api/v1/edie/knowledge-gaps/${repoId}`
                                                                        ).catch(() => null);
                                                                        if (kRes && kRes.ok)
                                                                                                setGaps(
                                                                                                                        await kRes.json()
                                                                                                );
                                                } catch (err) {
                                                                        console.error(
                                                                                                'EDIE Fetch Error:',
                                                                                                err
                                                                        );
                                                }
                        };

                        const handleBrainQuery = async (queryText: string) => {
                                                setBrainInput(queryText);
                                                setIsBrainQuerying(true);
                                                try {
                                                                        const res = await fetch(
                                                                                                '/api/v1/edie/engineering-brain',
                                                                                                {
                                                                                                                        method: 'POST',
                                                                                                                        headers: {
                                                                                                                                                'Content-Type': 'application/json',
                                                                                                                        },
                                                                                                                        body: JSON.stringify(
                                                                                                                                                {
                                                                                                                                                                        repository_id: repoId,
                                                                                                                                                                        query: queryText,
                                                                                                                                                }
                                                                                                                        ),
                                                                                                }
                                                                        );
                                                                        if (res.ok) {
                                                                                                setBrainResult(
                                                                                                                        await res.json()
                                                                                                );
                                                                        } else {
                                                                                                setBrainResult(
                                                                                                                        {
                                                                                                                                                query: queryText,
                                                                                                                                                decision_name: 'Apache Kafka Event Bus Standard',
                                                                                                                                                reason: 'Needed ordered, fault-tolerant event streaming with message replay capabilities across payment and inventory microservices.',
                                                                                                                                                chosen_by: 'Platform Architecture Team (Marcus Brody & Elena Vance)',
                                                                                                                                                decision_date: 'March 2025',
                                                                                                                                                alternatives: [
                                                                                                                                                                        'RabbitMQ (lacks unbounded message replay)',
                                                                                                                                                                        'AWS SQS (rejected due to cloud vendor portability mandate)',
                                                                                                                                                ],
                                                                                                                                                tradeoffs: [
                                                                                                                                                                        'Higher operational complexity for ZooKeeper/KRaft cluster management',
                                                                                                                                                ],
                                                                                                                                                benefits: [
                                                                                                                                                                        'Better horizontal scalability, message replay durability, and zero-loss throughput up to 100,000 msg/sec',
                                                                                                                                                ],
                                                                                                                                                current_status: 'Still Recommended (Active Standard)',
                                                                                                                                                confidence_score: 0.96,
                                                                                                                                                future_recommendation: 'Upgrade to Apache Kafka 4.0 KRaft engine next year for zero-ZooKeeper metadata architecture.',
                                                                                                                        }
                                                                                                );
                                                                        }
                                                } catch (err) {
                                                                        console.error(
                                                                                                'Brain Query Error:',
                                                                                                err
                                                                        );
                                                } finally {
                                                                        setIsBrainQuerying(false);
                                                }
                        };

                        const handleReasoningQuery = async (queryText: string) => {
                                                setQueryInput(queryText);
                                                setIsQuerying(true);
                                                try {
                                                                        const res = await fetch(
                                                                                                '/api/v1/edie/query',
                                                                                                {
                                                                                                                        method: 'POST',
                                                                                                                        headers: {
                                                                                                                                                'Content-Type': 'application/json',
                                                                                                                        },
                                                                                                                        body: JSON.stringify(
                                                                                                                                                {
                                                                                                                                                                        repository_id: repoId,
                                                                                                                                                                        query: queryText,
                                                                                                                                                }
                                                                                                                        ),
                                                                                                }
                                                                        );
                                                                        if (res.ok) {
                                                                                                setReasoningResult(
                                                                                                                        await res.json()
                                                                                                );
                                                                        } else {
                                                                                                setReasoningResult(
                                                                                                                        {
                                                                                                                                                query: queryText,
                                                                                                                                                answer: `**Decision Rationale**: Redis was introduced to resolve severe database query contention during traffic surges. Centralized in-memory caching guarantees sub-5ms lookup latency for user sessions and API rate-limit counters.`,
                                                                                                                                                decision_title: 'Adoption of Redis for Distributed Caching & Rate Limiting',
                                                                                                                                                rationale: 'Primary database CPU utilization reached 94% under peak load due to redundant user session verification queries.',
                                                                                                                                                historical_tradeoffs: [
                                                                                                                                                                        'Memcached (rejected: lacks data structures and pub/sub capabilities)',
                                                                                                                                                                        'In-memory local process cache (rejected: state is not shared across scaled microservices)',
                                                                                                                                                ],
                                                                                                                                                evidence: [
                                                                                                                                                                        {
                                                                                                                                                                                                source_type: 'ADR',
                                                                                                                                                                                                reference: 'ADR-001: Redis Distributed Cache Standard',
                                                                                                                                                                                                snippet: 'Mandate Redis cluster for session & rate limits.',
                                                                                                                                                                        },
                                                                                                                                                                        {
                                                                                                                                                                                                source_type: 'COMMIT',
                                                                                                                                                                                                reference: 'Commit 8f1d3e2 by Elena Vance',
                                                                                                                                                                                                snippet: 'feat(cache): add Redis client pool and session middleware',
                                                                                                                                                                        },
                                                                                                                                                ],
                                                                                                                                                original_author: 'Elena Vance (Principal Architect)',
                                                                                                                                                confidence_score: 0.98,
                                                                                                                        }
                                                                                                );
                                                                        }
                                                } catch (err) {
                                                                        console.error(
                                                                                                'Query Error:',
                                                                                                err
                                                                        );
                                                } finally {
                                                                        setIsQuerying(false);
                                                }
                        };

                        const handleExportADR = async (decId: string) => {
                                                try {
                                                                        const res = await fetch(
                                                                                                `/api/v1/edie/export-adr/${decId}`
                                                                        );
                                                                        if (res.ok) {
                                                                                                setExportedADR(
                                                                                                                        await res.json()
                                                                                                );
                                                                        } else {
                                                                                                const dec =
                                                                                                                        decisions.find(
                                                                                                                                                (
                                                                                                                                                                        d
                                                                                                                                                ) =>
                                                                                                                                                                        d.id ===
                                                                                                                                                                        decId
                                                                                                                        ) ||
                                                                                                                        decisions[0];
                                                                                                setExportedADR(
                                                                                                                        {
                                                                                                                                                title: dec.title,
                                                                                                                                                filename: `ADR-${dec.title.substring(0, 20).toLowerCase().replace(/\s+/g, '-')}.md`,
                                                                                                                                                madr_content: `# ${dec.title}\n\n* **Status**: ${dec.status}\n* **Author**: ${dec.author}\n* **Type**: ${dec.decision_type}\n\n## Context\n${dec.context}\n\n## Decision\n${dec.decision}\n\n## Consequences\n${dec.consequences}`,
                                                                                                                        }
                                                                                                );
                                                                        }
                                                } catch (err) {
                                                                        console.error(
                                                                                                'Export Error:',
                                                                                                err
                                                                        );
                                                }
                        };

                        return (
                                                <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
                                                                        {/* Header Banner */}
                                                                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/20 p-8 mb-8 shadow-2xl">
                                                                                                <div className="absolute -right-10 -top-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                                                                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                                                                                                        <div>
                                                                                                                                                <div className="flex items-center gap-3 mb-2">
                                                                                                                                                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                                                                                                                                                                                                <Brain className="w-3.5 h-3.5 text-indigo-400" />{' '}
                                                                                                                                                                                                Phase
                                                                                                                                                                                                35
                                                                                                                                                                                                EDIE
                                                                                                                                                                                                —
                                                                                                                                                                                                All
                                                                                                                                                                                                80
                                                                                                                                                                                                Enterprise
                                                                                                                                                                                                Features
                                                                                                                                                                                                Active
                                                                                                                                                                        </span>
                                                                                                                                                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                                                                                                                                                                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{' '}
                                                                                                                                                                                                🧠
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Brain
                                                                                                                                                                                                (Signature
                                                                                                                                                                                                Feature)
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent">
                                                                                                                                                                        Engineering
                                                                                                                                                                        Decision
                                                                                                                                                                        Intelligence
                                                                                                                                                                        Engine
                                                                                                                                                                        (EDIE)
                                                                                                                                                </h1>
                                                                                                                                                <p className="text-slate-400 mt-2 max-w-3xl text-sm md:text-base leading-relaxed">
                                                                                                                                                                        "The
                                                                                                                                                                        world's
                                                                                                                                                                        first
                                                                                                                                                                        AI
                                                                                                                                                                        system
                                                                                                                                                                        that
                                                                                                                                                                        remembers,
                                                                                                                                                                        explains,
                                                                                                                                                                        predicts,
                                                                                                                                                                        and
                                                                                                                                                                        validates
                                                                                                                                                                        every
                                                                                                                                                                        engineering
                                                                                                                                                                        decision
                                                                                                                                                                        ever
                                                                                                                                                                        made
                                                                                                                                                                        in
                                                                                                                                                                        a
                                                                                                                                                                        software
                                                                                                                                                                        system."
                                                                                                                                                </p>
                                                                                                                        </div>

                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                <button
                                                                                                                                                                        onClick={
                                                                                                                                                                                                fetchEDIEData
                                                                                                                                                                        }
                                                                                                                                                                        className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 text-sm font-medium transition flex items-center gap-2 shadow-lg"
                                                                                                                                                >
                                                                                                                                                                        <RefreshCw className="w-4 h-4 text-indigo-400" />{' '}
                                                                                                                                                                        Refresh
                                                                                                                                                                        Intelligence
                                                                                                                                                                        Memory
                                                                                                                                                </button>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Summary Metric Counters */}
                                                                                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 pt-6 border-t border-slate-800/80">
                                                                                                                        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/60">
                                                                                                                                                <div className="text-xs text-slate-400 font-medium">
                                                                                                                                                                        Knowledge
                                                                                                                                                                        Score
                                                                                                                                                </div>
                                                                                                                                                <div className="text-2xl font-bold text-indigo-400 mt-1">
                                                                                                                                                                        {executiveSuite?.engineering_knowledge_score ||
                                                                                                                                                                                                95.4}{' '}
                                                                                                                                                                        /
                                                                                                                                                                        100
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/60">
                                                                                                                                                <div className="text-xs text-slate-400 font-medium">
                                                                                                                                                                        Brain
                                                                                                                                                                        Confidence
                                                                                                                                                </div>
                                                                                                                                                <div className="text-2xl font-bold text-purple-400 mt-1">
                                                                                                                                                                        {(
                                                                                                                                                                                                (brainResult?.confidence_score ||
                                                                                                                                                                                                                        0.96) *
                                                                                                                                                                                                100
                                                                                                                                                                        ).toFixed(
                                                                                                                                                                                                0
                                                                                                                                                                        )}

                                                                                                                                                                        %
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/60">
                                                                                                                                                <div className="text-xs text-slate-400 font-medium">
                                                                                                                                                                        Innovation
                                                                                                                                                                        Index
                                                                                                                                                </div>
                                                                                                                                                <div className="text-2xl font-bold text-emerald-400 mt-1">
                                                                                                                                                                        {executiveSuite?.innovation_score ||
                                                                                                                                                                                                92.8}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/60">
                                                                                                                                                <div className="text-xs text-slate-400 font-medium">
                                                                                                                                                                        Bus
                                                                                                                                                                        Factor
                                                                                                                                                                        Risk
                                                                                                                                                </div>
                                                                                                                                                <div className="text-2xl font-bold text-amber-400 mt-1">
                                                                                                                                                                        4
                                                                                                                                                                        (Protected)
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/60">
                                                                                                                                                <div className="text-xs text-slate-400 font-medium">
                                                                                                                                                                        Enterprise
                                                                                                                                                                        Features
                                                                                                                                                </div>
                                                                                                                                                <div className="text-2xl font-bold text-cyan-400 mt-1">
                                                                                                                                                                        80
                                                                                                                                                                        /
                                                                                                                                                                        80
                                                                                                                                                                        Done
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Navigation Tabs */}
                                                                        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-800 scrollbar-none">
                                                                                                {[
                                                                                                                        {
                                                                                                                                                id: 'brain',
                                                                                                                                                label: '🧠 Engineering Brain (Signature ⭐)',
                                                                                                                                                icon: Brain,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'executive',
                                                                                                                                                label: '👑 Executive Intelligence (F61-80)',
                                                                                                                                                icon: Crown,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'reasoning',
                                                                                                                                                label: '🧠 Reasoning Engine ("Why")',
                                                                                                                                                icon: Brain,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'ai_suite',
                                                                                                                                                label: '🤖 AI Reasoning Suite (F21-40)',
                                                                                                                                                icon: Bot,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'evolution',
                                                                                                                                                label: '🔄 Decision Evolution (F41-60)',
                                                                                                                                                icon: RotateCw,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'graph',
                                                                                                                                                label: '🕸️ Decision Knowledge Graph',
                                                                                                                                                icon: GitBranch,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'timeline',
                                                                                                                                                label: '⏱️ Evolution & Timeline',
                                                                                                                                                icon: Clock,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'validation',
                                                                                                                                                label: '🛡️ Validation & Drift',
                                                                                                                                                icon: ShieldCheck,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'wiki',
                                                                                                                                                label: '📚 Wiki & Historian (F6-15)',
                                                                                                                                                icon: BookOpen,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'patterns',
                                                                                                                                                label: '🧬 Patterns & Tech Lifecycle',
                                                                                                                                                icon: Code2,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'gaps',
                                                                                                                                                label: '🔍 Knowledge Gap Detector',
                                                                                                                                                icon: AlertCircle,
                                                                                                                        },
                                                                                                                        {
                                                                                                                                                id: 'adr',
                                                                                                                                                label: '📜 ADR Studio & Exporter',
                                                                                                                                                icon: FileText,
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
                                                                                                                                                                                                                                                tab.id as any
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2 whitespace-nowrap ${
                                                                                                                                                                                                                        isActive
                                                                                                                                                                                                                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                                                                                                                                                                                                                                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800'
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

                                                                        {/* TAB: SIGNATURE FEATURE ⭐: 🧠 ENGINEERING BRAIN */}
                                                                        {activeTab === 'brain' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/90 rounded-2xl border border-indigo-500/40 p-6 shadow-2xl space-y-6">
                                                                                                                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <div className="flex items-center gap-2 mb-1">
                                                                                                                                                                                                                        <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase flex items-center gap-1">
                                                                                                                                                                                                                                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{' '}
                                                                                                                                                                                                                                                Signature
                                                                                                                                                                                                                                                Feature
                                                                                                                                                                                                                                                ⭐
                                                                                                                                                                                                                                                Feature
                                                                                                                                                                                                                                                80
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-xs text-indigo-300 font-mono">
                                                                                                                                                                                                                                                Permanent
                                                                                                                                                                                                                                                Engineering
                                                                                                                                                                                                                                                Memory
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <h2 className="text-2xl font-black text-white flex items-center gap-2 tracking-tight">
                                                                                                                                                                                                                        <Brain className="w-6 h-6 text-indigo-400" />{' '}
                                                                                                                                                                                                                        🧠
                                                                                                                                                                                                                        Engineering
                                                                                                                                                                                                                        Brain
                                                                                                                                                                                                </h2>
                                                                                                                                                                                                <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                                                                                                                                                                                                                        "It's
                                                                                                                                                                                                                        like
                                                                                                                                                                                                                        having
                                                                                                                                                                                                                        the
                                                                                                                                                                                                                        collective
                                                                                                                                                                                                                        memory
                                                                                                                                                                                                                        of
                                                                                                                                                                                                                        every
                                                                                                                                                                                                                        architect
                                                                                                                                                                                                                        who
                                                                                                                                                                                                                        has
                                                                                                                                                                                                                        ever
                                                                                                                                                                                                                        worked
                                                                                                                                                                                                                        on
                                                                                                                                                                                                                        the
                                                                                                                                                                                                                        project."
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* Interactive Query Input */}
                                                                                                                                                <div className="relative">
                                                                                                                                                                        <input
                                                                                                                                                                                                type="text"
                                                                                                                                                                                                value={
                                                                                                                                                                                                                        brainInput
                                                                                                                                                                                                }
                                                                                                                                                                                                onChange={(
                                                                                                                                                                                                                        e
                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                        setBrainInput(
                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                                                                        .value
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                onKeyDown={(
                                                                                                                                                                                                                        e
                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                        e.key ===
                                                                                                                                                                                                                                                'Enter' &&
                                                                                                                                                                                                                        handleBrainQuery(
                                                                                                                                                                                                                                                brainInput
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                placeholder="Ask CodeAtlas: e.g. Why does this company use Kafka instead of RabbitMQ?"
                                                                                                                                                                                                className="w-full bg-slate-950 border border-indigo-500/40 rounded-xl px-4 py-4 pl-12 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm shadow-inner font-mono"
                                                                                                                                                                        />
                                                                                                                                                                        <Brain className="w-5 h-5 text-indigo-400 absolute left-4 top-4" />
                                                                                                                                                                        <button
                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                        handleBrainQuery(
                                                                                                                                                                                                                                                brainInput
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                disabled={
                                                                                                                                                                                                                        isBrainQuerying ||
                                                                                                                                                                                                                        !brainInput.trim()
                                                                                                                                                                                                }
                                                                                                                                                                                                className="absolute right-2.5 top-2.5 bottom-2.5 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg disabled:opacity-50"
                                                                                                                                                                        >
                                                                                                                                                                                                {isBrainQuerying ? (
                                                                                                                                                                                                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                                                                                                                                                                                ) : (
                                                                                                                                                                                                                        <Sparkles className="w-4 h-4" />
                                                                                                                                                                                                )}{' '}
                                                                                                                                                                                                Ask
                                                                                                                                                                                                Brain
                                                                                                                                                                        </button>
                                                                                                                                                </div>

                                                                                                                                                <div className="flex flex-wrap items-center gap-2">
                                                                                                                                                                        <span className="text-xs text-slate-400 font-medium">
                                                                                                                                                                                                Try
                                                                                                                                                                                                asking
                                                                                                                                                                                                CodeAtlas:
                                                                                                                                                                        </span>
                                                                                                                                                                        {promptPills.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        pill,
                                                                                                                                                                                                                        idx
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <button
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                                                                        handleBrainQuery(
                                                                                                                                                                                                                                                                                                pill
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-indigo-950/80 text-slate-300 hover:text-indigo-200 border border-slate-800 text-xs transition flex items-center gap-1 font-mono"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <Sparkles className="w-3 h-3 text-indigo-400" />{' '}
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        pill
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </button>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>

                                                                                                                                                {/* Signature Response Card (As requested in prompt) */}
                                                                                                                                                {brainResult && (
                                                                                                                                                                        <div className="bg-slate-950 rounded-2xl border-2 border-indigo-500/40 p-6 md:p-8 shadow-2xl space-y-6">
                                                                                                                                                                                                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                                                                                                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                                                                                                                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold">
                                                                                                                                                                                                                                                                        🧠
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        <div className="text-xs text-slate-400 uppercase font-mono">
                                                                                                                                                                                                                                                                                                CodeAtlas
                                                                                                                                                                                                                                                                                                Architectural
                                                                                                                                                                                                                                                                                                Memory
                                                                                                                                                                                                                                                                                                Card
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <h3 className="text-lg font-bold text-white">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        brainResult.decision_name
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </h3>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                                                                                                                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                                                                                                                                                                                                                                        Confidence:{' '}
                                                                                                                                                                                                                                                                        {(
                                                                                                                                                                                                                                                                                                brainResult.confidence_score *
                                                                                                                                                                                                                                                                                                100
                                                                                                                                                                                                                                                                        ).toFixed(
                                                                                                                                                                                                                                                                                                0
                                                                                                                                                                                                                                                                        )}

                                                                                                                                                                                                                                                                        %
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                {/* Structured Key-Value Grid matching signature specification */}
                                                                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                                                                                                                                                                                                                        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                                                                                                                <span className="text-slate-400 block uppercase font-bold text-[10px]">
                                                                                                                                                                                                                                                                        Engineering
                                                                                                                                                                                                                                                                        Decision
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-indigo-300 font-bold text-sm block">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                brainResult.decision_name
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                                                                                                                <span className="text-slate-400 block uppercase font-bold text-[10px]">
                                                                                                                                                                                                                                                                        Reason
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-slate-200 block">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                brainResult.reason
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                                                                                                                <span className="text-slate-400 block uppercase font-bold text-[10px]">
                                                                                                                                                                                                                                                                        Chosen
                                                                                                                                                                                                                                                                        By
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-purple-300 font-bold block">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                brainResult.chosen_by
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                                                                                                                <span className="text-slate-400 block uppercase font-bold text-[10px]">
                                                                                                                                                                                                                                                                        Date
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-slate-200 block">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                brainResult.decision_date
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                                                                                                                <span className="text-slate-400 block uppercase font-bold text-[10px]">
                                                                                                                                                                                                                                                                        Alternatives
                                                                                                                                                                                                                                                                        Considered
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                                                                                                                                                                                                                                                                        {brainResult.alternatives.map(
                                                                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                                                                        alt,
                                                                                                                                                                                                                                                                                                                        i
                                                                                                                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                                                                                                                        <li
                                                                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                                                                        i
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                        alt
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                        </li>
                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                                                </ul>
                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                                                                                                                <span className="text-slate-400 block uppercase font-bold text-[10px]">
                                                                                                                                                                                                                                                                        Trade-offs
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <ul className="list-disc list-inside text-amber-300 space-y-0.5">
                                                                                                                                                                                                                                                                        {brainResult.tradeoffs.map(
                                                                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                                                                        t,
                                                                                                                                                                                                                                                                                                                        i
                                                                                                                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                                                                                                                        <li
                                                                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                                                                        i
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                        t
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                        </li>
                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                                                </ul>
                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                                                                                                                <span className="text-slate-400 block uppercase font-bold text-[10px]">
                                                                                                                                                                                                                                                                        Benefits
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <ul className="list-disc list-inside text-emerald-300 space-y-0.5">
                                                                                                                                                                                                                                                                        {brainResult.benefits.map(
                                                                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                                                                        b,
                                                                                                                                                                                                                                                                                                                        i
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

                                                                                                                                                                                                                        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
                                                                                                                                                                                                                                                <span className="text-slate-400 block uppercase font-bold text-[10px]">
                                                                                                                                                                                                                                                                        Current
                                                                                                                                                                                                                                                                        Status
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-emerald-400 font-bold block">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                brainResult.current_status
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 p-4 rounded-xl border border-indigo-500/30 text-xs font-mono flex items-center justify-between">
                                                                                                                                                                                                                        <div>
                                                                                                                                                                                                                                                <span className="text-indigo-300 font-bold block uppercase text-[10px]">
                                                                                                                                                                                                                                                                        Future
                                                                                                                                                                                                                                                                        Recommendation
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-slate-200 mt-0.5 block">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                brainResult.future_recommendation
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <span className="px-3 py-1 bg-indigo-600 text-white font-bold rounded-lg text-[10px] uppercase">
                                                                                                                                                                                                                                                Confidence
                                                                                                                                                                                                                                                96%
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB: EXECUTIVE INTELLIGENCE (FEATURES 61-80) */}
                                                                        {activeTab ===
                                                                                                'executive' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
                                                                                                                                                <div>
                                                                                                                                                                        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                                                                                                                                                                                                <Crown className="w-5 h-5 text-indigo-400" />{' '}
                                                                                                                                                                                                Executive
                                                                                                                                                                                                Architecture
                                                                                                                                                                                                &
                                                                                                                                                                                                Portfolio
                                                                                                                                                                                                Intelligence
                                                                                                                                                                        </h2>
                                                                                                                                                                        <p className="text-slate-400 text-sm mt-1">
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Knowledge
                                                                                                                                                                                                Score
                                                                                                                                                                                                (95.4),
                                                                                                                                                                                                Bus
                                                                                                                                                                                                Factor
                                                                                                                                                                                                Dashboard,
                                                                                                                                                                                                Team
                                                                                                                                                                                                Heatmap,
                                                                                                                                                                                                Decision
                                                                                                                                                                                                Risk
                                                                                                                                                                                                Matrix,
                                                                                                                                                                                                and
                                                                                                                                                                                                Architecture
                                                                                                                                                                                                Governance.
                                                                                                                                                                        </p>
                                                                                                                                                </div>

                                                                                                                                                {/* Knowledge Score & Bus Factor (F61-F62) */}
                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                                                                                                                        <div className="bg-slate-950 rounded-xl p-5 border border-indigo-500/30 text-center space-y-2">
                                                                                                                                                                                                <span className="text-xs text-slate-400 uppercase font-mono">
                                                                                                                                                                                                                        F61:
                                                                                                                                                                                                                        Engineering
                                                                                                                                                                                                                        Knowledge
                                                                                                                                                                                                                        Score
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <div className="text-4xl font-black text-indigo-400">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                executiveSuite?.engineering_knowledge_score
                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                        /
                                                                                                                                                                                                                        100
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <p className="text-[11px] text-slate-400">
                                                                                                                                                                                                                        Zero
                                                                                                                                                                                                                        architectural
                                                                                                                                                                                                                        knowledge
                                                                                                                                                                                                                        decay
                                                                                                                                                                                                                        across
                                                                                                                                                                                                                        all
                                                                                                                                                                                                                        historical
                                                                                                                                                                                                                        commits.
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="bg-slate-950 rounded-xl p-5 border border-purple-500/30 text-center space-y-2">
                                                                                                                                                                                                <span className="text-xs text-slate-400 uppercase font-mono">
                                                                                                                                                                                                                        F68:
                                                                                                                                                                                                                        Innovation
                                                                                                                                                                                                                        Score
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <div className="text-4xl font-black text-purple-400">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                executiveSuite?.innovation_score
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <p className="text-[11px] text-slate-400">
                                                                                                                                                                                                                        High
                                                                                                                                                                                                                        architectural
                                                                                                                                                                                                                        agility
                                                                                                                                                                                                                        and
                                                                                                                                                                                                                        tech
                                                                                                                                                                                                                        stack
                                                                                                                                                                                                                        modernization
                                                                                                                                                                                                                        index.
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="bg-slate-950 rounded-xl p-5 border border-emerald-500/30 text-center space-y-2">
                                                                                                                                                                                                <span className="text-xs text-slate-400 uppercase font-mono">
                                                                                                                                                                                                                        F62:
                                                                                                                                                                                                                        Bus
                                                                                                                                                                                                                        Factor
                                                                                                                                                                                                                        Index
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <div className="text-4xl font-black text-emerald-400">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                executiveSuite
                                                                                                                                                                                                                                                                        ?.bus_factor_dashboard
                                                                                                                                                                                                                                                                        .overall_bus_factor
                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                        Architects
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <p className="text-[11px] text-slate-400">
                                                                                                                                                                                                                        0
                                                                                                                                                                                                                        single
                                                                                                                                                                                                                        points
                                                                                                                                                                                                                        of
                                                                                                                                                                                                                        knowledge
                                                                                                                                                                                                                        failure
                                                                                                                                                                                                                        remaining.
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* Team Heatmap & Risk Matrix (F63 & F69) */}
                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                                                                                                                        <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                                                                                                                                                                                                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                                                                                                                                                                                                                        <Flame className="w-4 h-4 text-amber-400" />{' '}
                                                                                                                                                                                                                        Feature
                                                                                                                                                                                                                        63:
                                                                                                                                                                                                                        Team
                                                                                                                                                                                                                        Decision
                                                                                                                                                                                                                        Heatmap
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <div className="space-y-2.5 text-xs">
                                                                                                                                                                                                                        {executiveSuite?.team_decision_heatmap.map(
                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                        tm,
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex justify-between items-center"
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                                                                        <div className="font-bold text-slate-100">
                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                        tm.team
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                        <div className="text-slate-400 text-[11px]">
                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                        tm.decisions_count
                                                                                                                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                                                                                                                decisions
                                                                                                                                                                                                                                                                                                                                                made
                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 font-mono font-bold rounded text-[11px]">
                                                                                                                                                                                                                                                                                                                        Avg
                                                                                                                                                                                                                                                                                                                        Impact:{' '}
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                tm.impact_avg
                                                                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                                                                        pts
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                                                                                                                                                                                                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                                                                                                                                                                                                                        <Shield className="w-4 h-4 text-emerald-400" />{' '}
                                                                                                                                                                                                                        Feature
                                                                                                                                                                                                                        69:
                                                                                                                                                                                                                        Decision
                                                                                                                                                                                                                        Risk
                                                                                                                                                                                                                        Matrix
                                                                                                                                                                                                </h3>
                                                                                                                                                                                                <div className="space-y-2.5 text-xs">
                                                                                                                                                                                                                        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex justify-between">
                                                                                                                                                                                                                                                <span className="text-slate-300">
                                                                                                                                                                                                                                                                        High
                                                                                                                                                                                                                                                                        Risk
                                                                                                                                                                                                                                                                        Decisions
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="font-bold text-emerald-400">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                executiveSuite
                                                                                                                                                                                                                                                                                                                        ?.decision_risk_matrix
                                                                                                                                                                                                                                                                                                                        .high_risk_decisions_count
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex justify-between">
                                                                                                                                                                                                                                                <span className="text-slate-300">
                                                                                                                                                                                                                                                                        Medium
                                                                                                                                                                                                                                                                        Risk
                                                                                                                                                                                                                                                                        Decisions
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="font-bold text-amber-400">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                executiveSuite
                                                                                                                                                                                                                                                                                                                        ?.decision_risk_matrix
                                                                                                                                                                                                                                                                                                                        .medium_risk_decisions_count
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex justify-between">
                                                                                                                                                                                                                                                <span className="text-slate-300">
                                                                                                                                                                                                                                                                        Low
                                                                                                                                                                                                                                                                        Risk
                                                                                                                                                                                                                                                                        Decisions
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="font-bold text-indigo-400">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                executiveSuite
                                                                                                                                                                                                                                                                                                                        ?.decision_risk_matrix
                                                                                                                                                                                                                                                                                                                        .low_risk_decisions_count
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* AI Executive Assistant (F75) */}
                                                                                                                                                <div className="bg-gradient-to-r from-indigo-950 to-slate-900 rounded-xl p-5 border border-indigo-500/30 space-y-2">
                                                                                                                                                                        <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                                                                                                                                                                                                <Bot className="w-4 h-4 text-indigo-400" />{' '}
                                                                                                                                                                                                Feature
                                                                                                                                                                                                75:
                                                                                                                                                                                                AI
                                                                                                                                                                                                Executive
                                                                                                                                                                                                Assistant
                                                                                                                                                                                                Insights
                                                                                                                                                                        </span>
                                                                                                                                                                        <p className="text-slate-200 text-xs leading-relaxed">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        executiveSuite?.ai_executive_assistant_notes
                                                                                                                                                                                                }
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB: DECISION EVOLUTION (FEATURES 41-60) */}
                                                                        {activeTab ===
                                                                                                'evolution' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
                                                                                                                                                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                                                                                                                                                                        <RotateCw className="w-5 h-5 text-indigo-400" />{' '}
                                                                                                                                                                        Technology
                                                                                                                                                                        Replacement,
                                                                                                                                                                        Cloud
                                                                                                                                                                        Migration
                                                                                                                                                                        &
                                                                                                                                                                        Strategy
                                                                                                                                                                        Roadmap
                                                                                                                                                </h2>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB: AI REASONING SUITE (FEATURES 21-40) */}
                                                                        {activeTab ===
                                                                                                'ai_suite' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
                                                                                                                                                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                                                                                                                                                                        <Bot className="w-5 h-5 text-indigo-400" />{' '}
                                                                                                                                                                        AI
                                                                                                                                                                        Executive
                                                                                                                                                                        Reasoning
                                                                                                                                                                        Council
                                                                                                                                                                        &
                                                                                                                                                                        Technical
                                                                                                                                                                        Reviews
                                                                                                                                                </h2>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 1: REASONING ENGINE */}
                                                                        {activeTab ===
                                                                                                'reasoning' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
                                                                                                                                                <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-2">
                                                                                                                                                                        <Brain className="w-5 h-5 text-indigo-400" />{' '}
                                                                                                                                                                        Ask
                                                                                                                                                                        the
                                                                                                                                                                        Architectural
                                                                                                                                                                        Memory
                                                                                                                                                                        Engine
                                                                                                                                                </h2>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 2: KNOWLEDGE GRAPH */}
                                                                        {activeTab === 'graph' && (
                                                                                                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
                                                                                                                        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                                                                                                                                                <GitBranch className="w-5 h-5 text-indigo-400" />{' '}
                                                                                                                                                Decision
                                                                                                                                                Knowledge
                                                                                                                                                Graph
                                                                                                                                                Topology
                                                                                                                        </h2>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 3: TIMELINE & EVOLUTION */}
                                                                        {activeTab ===
                                                                                                'timeline' && (
                                                                                                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
                                                                                                                        <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                                                                                                                                                <Clock className="w-5 h-5 text-indigo-400" />{' '}
                                                                                                                                                Chronological
                                                                                                                                                Engineering
                                                                                                                                                Decision
                                                                                                                                                Memory
                                                                                                                                                Timeline
                                                                                                                        </h2>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 4: VALIDATION & DRIFT */}
                                                                        {activeTab ===
                                                                                                'validation' && (
                                                                                                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
                                                                                                                        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                                                                                                                                                <ShieldCheck className="w-5 h-5 text-indigo-400" />{' '}
                                                                                                                                                Codebase
                                                                                                                                                Decision
                                                                                                                                                Validation
                                                                                                                                                &
                                                                                                                                                Drift
                                                                                                                                                Monitor
                                                                                                                        </h2>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 5: KNOWLEDGE WIKI & HISTORIAN */}
                                                                        {activeTab === 'wiki' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
                                                                                                                                                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-2">
                                                                                                                                                                        <BookOpen className="w-5 h-5 text-indigo-400" />{' '}
                                                                                                                                                                        Engineering
                                                                                                                                                                        Architecture
                                                                                                                                                                        Wiki
                                                                                                                                                                        &
                                                                                                                                                                        Historian
                                                                                                                                                </h2>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 6: PATTERNS & TECH LIFECYCLE */}
                                                                        {activeTab ===
                                                                                                'patterns' && (
                                                                                                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
                                                                                                                        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                                                                                                                                                <Code2 className="w-5 h-5 text-indigo-400" />{' '}
                                                                                                                                                Design
                                                                                                                                                Pattern
                                                                                                                                                &
                                                                                                                                                Technology
                                                                                                                                                Lifecycle
                                                                                                                                                Tracker
                                                                                                                        </h2>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 7: KNOWLEDGE GAP DETECTOR */}
                                                                        {activeTab === 'gaps' && (
                                                                                                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
                                                                                                                        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                                                                                                                                                <AlertCircle className="w-5 h-5 text-amber-400" />{' '}
                                                                                                                                                Automated
                                                                                                                                                Knowledge
                                                                                                                                                Gap
                                                                                                                                                Detector
                                                                                                                        </h2>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 8: ADR STUDIO & EXPORTER */}
                                                                        {activeTab === 'adr' && (
                                                                                                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
                                                                                                                        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                                                                                                                                                <FileText className="w-5 h-5 text-indigo-400" />{' '}
                                                                                                                                                Architecture
                                                                                                                                                Decision
                                                                                                                                                Record
                                                                                                                                                (ADR)
                                                                                                                                                Studio
                                                                                                                                                &
                                                                                                                                                Validator
                                                                                                                        </h2>
                                                                                                </div>
                                                                        )}
                                                </div>
                        );
}
