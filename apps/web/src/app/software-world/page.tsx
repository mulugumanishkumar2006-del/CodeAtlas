'use client';

import * as React from 'react';
import { useAuth } from '@/context/auth-context';
import {
                        ReactFlow,
                        Background,
                        Controls,
                        MiniMap,
                        useNodesState,
                        useEdgesState,
                        MarkerType,
                        Node,
                        Edge,
                        Handle,
                        Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {
                        Search,
                        Filter,
                        Activity,
                        AlertTriangle,
                        ShieldAlert,
                        RotateCw,
                        Play,
                        Zap,
                        Network,
                        BookOpen,
                        Layers,
                        GitBranch,
                        Sliders,
                        Server,
                        X,
                        Maximize2,
                        Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- Custom Node Component ---
interface CustomNodeData {
                        name: string;
                        primary_language: string;
                        health_score: number;
                        lines_of_code: number;
                        coverage: number;
                        complexity: number;
                        alerts: string[];
                        is_mock: boolean;
                        clone_url: string;
                        status: string;
                        isSelected?: boolean;
                        isChaosSource?: boolean;
                        isChaosAffected?: boolean;
}

const getLanguageColor = (lang: string) => {
                        switch (lang.toLowerCase()) {
                                                case 'go':
                                                                        return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
                                                case 'python':
                                                                        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
                                                case 'rust':
                                                                        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
                                                case 'typescript':
                                                case 'javascript':
                                                                        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
                                                case 'java':
                                                                        return 'bg-red-500/20 text-red-400 border-red-500/30';
                                                case 'swift':
                                                                        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
                                                case 'kotlin':
                                                                        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
                                                default:
                                                                        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
                        }
};

const CustomRepositoryNode = ({ data }: { data: CustomNodeData }) => {
                        const isOutage = data.status === 'outage' || data.isChaosSource;
                        const isDegraded = data.status === 'degraded' || data.isChaosAffected;

                        let borderClass = 'border-zinc-800 bg-zinc-950/80 hover:border-zinc-700';
                        let pulseClass = '';

                        if (data.isSelected) {
                                                borderClass =
                                                                        'border-primary ring-2 ring-primary/40 bg-zinc-950/90';
                        }

                        if (isOutage) {
                                                borderClass =
                                                                        'border-red-500 bg-red-950/30 ring-2 ring-red-500/50';
                                                pulseClass = 'animate-pulse';
                        } else if (isDegraded) {
                                                borderClass =
                                                                        'border-amber-500 bg-amber-950/20 ring-1 ring-amber-500/40';
                        }

                        return (
                                                <div
                                                                        className={`relative px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 w-60 ${borderClass} ${pulseClass}`}
                                                >
                                                                        {/* Input Handles for React Flow connections */}
                                                                        <Handle
                                                                                                type="target"
                                                                                                position={
                                                                                                                        Position.Top
                                                                                                }
                                                                                                className="!bg-zinc-700 !w-2.5 !h-2.5"
                                                                        />

                                                                        <div className="flex items-start justify-between gap-2 mb-2">
                                                                                                <div className="overflow-hidden">
                                                                                                                        <div className="flex items-center gap-1.5">
                                                                                                                                                <GitBranch
                                                                                                                                                                        className={`h-3.5 w-3.5 shrink-0 ${isOutage ? 'text-red-400' : isDegraded ? 'text-amber-400' : 'text-primary'}`}
                                                                                                                                                />
                                                                                                                                                <span className="text-[13px] font-bold text-foreground truncate block max-w-[120px] font-mono">
                                                                                                                                                                        {
                                                                                                                                                                                                data.name
                                                                                                                                                                        }
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <span className="text-[10px] text-muted-foreground block truncate">
                                                                                                                                                {data.is_mock
                                                                                                                                                                        ? 'Mock Enterprise'
                                                                                                                                                                        : 'Active DB'}
                                                                                                                        </span>
                                                                                                </div>

                                                                                                {/* Language badge */}
                                                                                                <span
                                                                                                                        className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${getLanguageColor(data.primary_language)}`}
                                                                                                >
                                                                                                                        {
                                                                                                                                                data.primary_language
                                                                                                                        }
                                                                                                </span>
                                                                        </div>

                                                                        {/* Health indicators */}
                                                                        <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 text-[11px] gap-2">
                                                                                                <div className="flex items-center gap-1">
                                                                                                                        <span className="text-muted-foreground">
                                                                                                                                                Health:
                                                                                                                        </span>
                                                                                                                        <span
                                                                                                                                                className={`font-semibold ${isOutage ? 'text-red-400' : isDegraded ? 'text-amber-400' : 'text-emerald-400'}`}
                                                                                                                        >
                                                                                                                                                {isOutage
                                                                                                                                                                        ? '0%'
                                                                                                                                                                        : isDegraded
                                                                                                                                                                          ? `${Math.min(50, data.health_score)}%`
                                                                                                                                                                          : `${data.health_score}%`}
                                                                                                                        </span>
                                                                                                </div>
                                                                                                <div className="flex items-center gap-1">
                                                                                                                        {data
                                                                                                                                                .alerts
                                                                                                                                                .length >
                                                                                                                                                0 &&
                                                                                                                                                !isOutage && (
                                                                                                                                                                        <div
                                                                                                                                                                                                className="flex items-center gap-0.5 text-amber-400 font-semibold"
                                                                                                                                                                                                title={
                                                                                                                                                                                                                        data
                                                                                                                                                                                                                                                .alerts[0]
                                                                                                                                                                                                }
                                                                                                                                                                        >
                                                                                                                                                                                                <AlertTriangle className="h-3 w-3" />
                                                                                                                                                                                                <span>
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                data
                                                                                                                                                                                                                                                                        .alerts
                                                                                                                                                                                                                                                                        .length
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                )}
                                                                                                                        {isOutage && (
                                                                                                                                                <div className="flex items-center gap-0.5 text-red-400 font-semibold">
                                                                                                                                                                        <ShieldAlert className="h-3 w-3" />
                                                                                                                                                                        <span>
                                                                                                                                                                                                OUTAGE
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                        )}
                                                                                                                        {!isOutage &&
                                                                                                                                                !isDegraded &&
                                                                                                                                                data
                                                                                                                                                                        .alerts
                                                                                                                                                                        .length ===
                                                                                                                                                                        0 && (
                                                                                                                                                                        <span className="text-emerald-500 text-[10px] font-semibold">
                                                                                                                                                                                                Healthy
                                                                                                                                                                        </span>
                                                                                                                                                )}
                                                                                                </div>
                                                                        </div>

                                                                        {/* Bottom Output Handles */}
                                                                        <Handle
                                                                                                type="source"
                                                                                                position={
                                                                                                                        Position.Bottom
                                                                                                }
                                                                                                className="!bg-zinc-700 !w-2.5 !h-2.5"
                                                                        />
                                                </div>
                        );
};

// Map React Flow node Types to custom components
const nodeTypes = {
                        repository: CustomRepositoryNode,
};

export default function SoftwareWorldPage() {
                        const { token } = useAuth();

                        // UI Layout states
                        const [scale, setScale] = React.useState<13 | 300>(13);
                        const [searchQuery, setSearchQuery] = React.useState<string>('');
                        const [selectedNode, setSelectedNode] = React.useState<Node<any> | null>(
                                                null
                        );
                        const [connectionFilters, setConnectionFilters] = React.useState({
                                                api: true,
                                                event: true,
                                                library: true,
                        });
                        const [loading, setLoading] = React.useState<boolean>(false);

                        // Flow Node States
                        const [nodes, setNodes, onNodesChange] = useNodesState<Node<any>>([]);
                        const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<any>>([]);

                        // Chaos simulation states
                        const [chaosSourceId, setChaosSourceId] = React.useState<string | null>(
                                                null
                        );
                        const [affectedNodeIds, setAffectedNodeIds] = React.useState<Set<string>>(
                                                new Set()
                        );

                        // Fetch Software World Graph
                        const fetchWorldTopology = React.useCallback(
                                                (currentScale: number) => {
                                                                        if (!token) return;
                                                                        setLoading(true);
                                                                        setSelectedNode(null);
                                                                        setChaosSourceId(null);
                                                                        setAffectedNodeIds(
                                                                                                new Set()
                                                                        );

                                                                        fetch(
                                                                                                `/api/v1/software-world?scale=${currentScale}`,
                                                                                                {
                                                                                                                        headers: {
                                                                                                                                                Authorization: `Bearer ${token}`,
                                                                                                                        },
                                                                                                }
                                                                        )
                                                                                                .then(
                                                                                                                        (
                                                                                                                                                res
                                                                                                                        ) =>
                                                                                                                                                res.json()
                                                                                                )
                                                                                                .then(
                                                                                                                        (
                                                                                                                                                data
                                                                                                                        ) => {
                                                                                                                                                // Transform backend models to React Flow Nodes
                                                                                                                                                const flowNodes: Node[] =
                                                                                                                                                                        data.nodes.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        node: any
                                                                                                                                                                                                ) => ({
                                                                                                                                                                                                                        id: node.id,
                                                                                                                                                                                                                        type: 'repository',
                                                                                                                                                                                                                        position: {
                                                                                                                                                                                                                                                x: node.x,
                                                                                                                                                                                                                                                y: node.y,
                                                                                                                                                                                                                        },
                                                                                                                                                                                                                        data: {
                                                                                                                                                                                                                                                name: node.name,
                                                                                                                                                                                                                                                primary_language: node.primary_language,
                                                                                                                                                                                                                                                health_score: node.health_score,
                                                                                                                                                                                                                                                lines_of_code: node.lines_of_code,
                                                                                                                                                                                                                                                coverage: node.coverage,
                                                                                                                                                                                                                                                complexity: node.complexity,
                                                                                                                                                                                                                                                alerts: node.alerts,
                                                                                                                                                                                                                                                is_mock: node.is_mock,
                                                                                                                                                                                                                                                clone_url: node.clone_url,
                                                                                                                                                                                                                                                status: node.status,
                                                                                                                                                                                                                                                isSelected: false,
                                                                                                                                                                                                                                                isChaosSource: false,
                                                                                                                                                                                                                                                isChaosAffected: false,
                                                                                                                                                                                                                        },
                                                                                                                                                                                                })
                                                                                                                                                                        );

                                                                                                                                                // Transform backend edges to React Flow Edges
                                                                                                                                                const flowEdges: Edge[] =
                                                                                                                                                                        data.edges.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        edge: any
                                                                                                                                                                                                ) => {
                                                                                                                                                                                                                        let edgeColor =
                                                                                                                                                                                                                                                '#71717a'; // gray for default
                                                                                                                                                                                                                        if (
                                                                                                                                                                                                                                                edge.type ===
                                                                                                                                                                                                                                                'api'
                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                edgeColor =
                                                                                                                                                                                                                                                                        '#a855f7'; // purple
                                                                                                                                                                                                                        else if (
                                                                                                                                                                                                                                                edge.type ===
                                                                                                                                                                                                                                                'event'
                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                edgeColor =
                                                                                                                                                                                                                                                                        '#22c55e'; // green
                                                                                                                                                                                                                        else if (
                                                                                                                                                                                                                                                edge.type ===
                                                                                                                                                                                                                                                'library'
                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                edgeColor =
                                                                                                                                                                                                                                                                        '#eab308'; // yellow

                                                                                                                                                                                                                        return {
                                                                                                                                                                                                                                                id: edge.id,
                                                                                                                                                                                                                                                source: edge.source,
                                                                                                                                                                                                                                                target: edge.target,
                                                                                                                                                                                                                                                animated: edge.is_critical,
                                                                                                                                                                                                                                                label: edge.label,
                                                                                                                                                                                                                                                type: 'smoothstep',
                                                                                                                                                                                                                                                style: {
                                                                                                                                                                                                                                                                        stroke: edgeColor,
                                                                                                                                                                                                                                                                        strokeWidth: edge.is_critical
                                                                                                                                                                                                                                                                                                ? 2
                                                                                                                                                                                                                                                                                                : 1,
                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                markerEnd: {
                                                                                                                                                                                                                                                                        type: MarkerType.ArrowClosed,
                                                                                                                                                                                                                                                                        width: 15,
                                                                                                                                                                                                                                                                        height: 15,
                                                                                                                                                                                                                                                                        color: edgeColor,
                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                data: {
                                                                                                                                                                                                                                                                        type: edge.type,
                                                                                                                                                                                                                                                                        is_critical: edge.is_critical,
                                                                                                                                                                                                                                                                        originalColor: edgeColor,
                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                        };
                                                                                                                                                                                                }
                                                                                                                                                                        );

                                                                                                                                                setNodes(
                                                                                                                                                                        flowNodes
                                                                                                                                                );
                                                                                                                                                setEdges(
                                                                                                                                                                        flowEdges
                                                                                                                                                );
                                                                                                                                                setLoading(
                                                                                                                                                                        false
                                                                                                                                                );
                                                                                                                        }
                                                                                                )
                                                                                                .catch(
                                                                                                                        (
                                                                                                                                                err
                                                                                                                        ) => {
                                                                                                                                                console.error(
                                                                                                                                                                        'Error fetching software world layout',
                                                                                                                                                                        err
                                                                                                                                                );
                                                                                                                                                setLoading(
                                                                                                                                                                        false
                                                                                                                                                );
                                                                                                                        }
                                                                                                );
                                                },
                                                [token, setNodes, setEdges]
                        );

                        React.useEffect(() => {
                                                fetchWorldTopology(scale);
                        }, [scale, fetchWorldTopology]);

                        // Handle Node Selection
                        const onNodeClick = React.useCallback(
                                                (event: React.MouseEvent, node: Node) => {
                                                                        // Mark node as selected visually
                                                                        setNodes((nds) =>
                                                                                                nds.map(
                                                                                                                        (
                                                                                                                                                n
                                                                                                                        ) => ({
                                                                                                                                                ...n,
                                                                                                                                                data: {
                                                                                                                                                                        ...n.data,
                                                                                                                                                                        isSelected:
                                                                                                                                                                                                n.id ===
                                                                                                                                                                                                node.id,
                                                                                                                                                },
                                                                                                                        })
                                                                                                )
                                                                        );
                                                                        setSelectedNode(node);
                                                },
                                                [setNodes]
                        );

                        // Apply connection filters to edges
                        React.useEffect(() => {
                                                setEdges((eds) =>
                                                                        eds.map((edge) => {
                                                                                                const edgeType =
                                                                                                                        edge
                                                                                                                                                .data
                                                                                                                                                ?.type as string;
                                                                                                const isVisible =
                                                                                                                        connectionFilters[
                                                                                                                                                edgeType as keyof typeof connectionFilters
                                                                                                                        ];
                                                                                                return {
                                                                                                                        ...edge,
                                                                                                                        style: {
                                                                                                                                                ...edge.style,
                                                                                                                                                stroke: isVisible
                                                                                                                                                                        ? (edge
                                                                                                                                                                                                  .data
                                                                                                                                                                                                  ?.originalColor as string)
                                                                                                                                                                        : 'transparent',
                                                                                                                                                strokeWidth: isVisible
                                                                                                                                                                        ? edge
                                                                                                                                                                                                  .data
                                                                                                                                                                                                  ?.is_critical
                                                                                                                                                                                                ? 2
                                                                                                                                                                                                : 1
                                                                                                                                                                        : 0,
                                                                                                                        },
                                                                                                                        markerEnd: isVisible
                                                                                                                                                ? edge.markerEnd
                                                                                                                                                : undefined,
                                                                                                                        label: isVisible
                                                                                                                                                ? edge.label
                                                                                                                                                : '',
                                                                                                };
                                                                        })
                                                );
                        }, [connectionFilters, setEdges]);

                        // Search Node Focus
                        const handleSearchSubmit = (e: React.FormEvent) => {
                                                e.preventDefault();
                                                if (!searchQuery) return;

                                                const targetNode = nodes.find((n) =>
                                                                        n.data.name
                                                                                                .toLowerCase()
                                                                                                .includes(
                                                                                                                        searchQuery.toLowerCase()
                                                                                                )
                                                );

                                                if (targetNode) {
                                                                        // Select and highlight target node
                                                                        setNodes((nds) =>
                                                                                                nds.map(
                                                                                                                        (
                                                                                                                                                n
                                                                                                                        ) => ({
                                                                                                                                                ...n,
                                                                                                                                                data: {
                                                                                                                                                                        ...n.data,
                                                                                                                                                                        isSelected:
                                                                                                                                                                                                n.id ===
                                                                                                                                                                                                targetNode.id,
                                                                                                                                                },
                                                                                                                        })
                                                                                                )
                                                                        );
                                                                        setSelectedNode(targetNode);

                                                                        // Note: In React Flow v11, centering requires useReactFlow, but since we are simple
                                                                        // we will let the user navigate or search focus. Setting search highlighted state suffices.
                                                }
                        };

                        // live chaos monkeys failure propagation
                        const triggerChaosSimulation = () => {
                                                if (!selectedNode) return;

                                                const sourceId = selectedNode.id;
                                                setChaosSourceId(sourceId);

                                                // Find cascading outages: BFS traversal of egress nodes
                                                const queue: string[] = [sourceId];
                                                const visited = new Set<string>([sourceId]);
                                                const propagationPath = new Set<string>();

                                                while (queue.length > 0) {
                                                                        const current =
                                                                                                queue.shift()!;

                                                                        // Find edges outgoing from current
                                                                        const outgoingEdges =
                                                                                                edges.filter(
                                                                                                                        (
                                                                                                                                                e
                                                                                                                        ) =>
                                                                                                                                                e.source ===
                                                                                                                                                                        current &&
                                                                                                                                                e
                                                                                                                                                                        .data
                                                                                                                                                                        ?.type !==
                                                                                                                                                                        'library'
                                                                                                ); // library packages don't cascade network runtime timeouts

                                                                        for (const edge of outgoingEdges) {
                                                                                                if (
                                                                                                                        !visited.has(
                                                                                                                                                edge.target
                                                                                                                        )
                                                                                                ) {
                                                                                                                        visited.add(
                                                                                                                                                edge.target
                                                                                                                        );
                                                                                                                        queue.push(
                                                                                                                                                edge.target
                                                                                                                        );
                                                                                                                        propagationPath.add(
                                                                                                                                                edge.target
                                                                                                                        );
                                                                                                }
                                                                        }
                                                }

                                                setAffectedNodeIds(propagationPath);

                                                // Update Node Visuals for Outage
                                                setNodes((nds) =>
                                                                        nds.map((n) => {
                                                                                                const isSrc =
                                                                                                                        n.id ===
                                                                                                                        sourceId;
                                                                                                const isAff =
                                                                                                                        propagationPath.has(
                                                                                                                                                n.id
                                                                                                                        );
                                                                                                return {
                                                                                                                        ...n,
                                                                                                                        data: {
                                                                                                                                                ...n.data,
                                                                                                                                                isChaosSource: isSrc,
                                                                                                                                                isChaosAffected: isAff,
                                                                                                                                                status: isSrc
                                                                                                                                                                        ? 'outage'
                                                                                                                                                                        : isAff
                                                                                                                                                                          ? 'degraded'
                                                                                                                                                                          : n
                                                                                                                                                                                                    .data
                                                                                                                                                                                                    .status,
                                                                                                                        },
                                                                                                };
                                                                        })
                                                );

                                                // Animate Edges affected by chaos
                                                setEdges((eds) =>
                                                                        eds.map((edge) => {
                                                                                                const isCascade =
                                                                                                                        visited.has(
                                                                                                                                                edge.source
                                                                                                                        ) &&
                                                                                                                        visited.has(
                                                                                                                                                edge.target
                                                                                                                        );
                                                                                                if (
                                                                                                                        isCascade
                                                                                                ) {
                                                                                                                        return {
                                                                                                                                                ...edge,
                                                                                                                                                animated: true,
                                                                                                                                                style: {
                                                                                                                                                                        ...edge.style,
                                                                                                                                                                        stroke: '#ef4444', // critical red
                                                                                                                                                                        strokeWidth: 3,
                                                                                                                                                },
                                                                                                                        };
                                                                                                }
                                                                                                return edge;
                                                                        })
                                                );
                        };

                        // Reset Simulation
                        const handleReset = () => {
                                                fetchWorldTopology(scale);
                        };

                        // Calculate overall stats
                        const averageHealth = React.useMemo(() => {
                                                if (nodes.length === 0) return 0;
                                                const total = nodes.reduce((sum, n) => {
                                                                        if (n.data.isChaosSource)
                                                                                                return sum;
                                                                        if (n.data.isChaosAffected)
                                                                                                return (
                                                                                                                        sum +
                                                                                                                        Math.min(
                                                                                                                                                50,
                                                                                                                                                n
                                                                                                                                                                        .data
                                                                                                                                                                        .health_score
                                                                                                                        )
                                                                                                );
                                                                        return (
                                                                                                sum +
                                                                                                n
                                                                                                                        .data
                                                                                                                        .health_score
                                                                        );
                                                }, 0);
                                                return Math.round(total / nodes.length);
                        }, [nodes]);

                        const activeAlertsCount = React.useMemo(() => {
                                                return nodes.reduce((sum, n) => {
                                                                        let add =
                                                                                                n
                                                                                                                        .data
                                                                                                                        .alerts
                                                                                                                        .length;
                                                                        if (n.data.isChaosSource)
                                                                                                add += 1;
                                                                        if (n.data.isChaosAffected)
                                                                                                add += 1;
                                                                        return sum + add;
                                                }, 0);
                        }, [nodes]);

                        const outageCount = React.useMemo(() => {
                                                return nodes.filter(
                                                                        (n) =>
                                                                                                n
                                                                                                                        .data
                                                                                                                        .status ===
                                                                                                                        'outage' ||
                                                                                                n
                                                                                                                        .data
                                                                                                                        .isChaosSource
                                                ).length;
                        }, [nodes]);

                        return (
                                                <div className="flex h-full w-full overflow-hidden bg-background">
                                                                        <div className="flex flex-1 flex-col h-full overflow-hidden">
                                                                                                {/* Header dashboard options */}
                                                                                                <header className="border-b bg-card px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                                                                                                                        <div>
                                                                                                                                                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                                                                                                                                                                        <Layers className="h-5 w-5 text-primary" />
                                                                                                                                                                        Multi-Repository
                                                                                                                                                                        Software
                                                                                                                                                                        World
                                                                                                                                                </h2>
                                                                                                                                                <p className="text-xs text-muted-foreground">
                                                                                                                                                                        Visualizing
                                                                                                                                                                        dependencies
                                                                                                                                                                        and
                                                                                                                                                                        cascading
                                                                                                                                                                        risks
                                                                                                                                                                        across{' '}
                                                                                                                                                                        {
                                                                                                                                                                                                nodes.length
                                                                                                                                                                        }{' '}
                                                                                                                                                                        microservices.
                                                                                                                                                </p>
                                                                                                                        </div>

                                                                                                                        {/* Real-time stats */}
                                                                                                                        <div className="flex items-center gap-6 text-[12px] bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800">
                                                                                                                                                <div className="flex items-center gap-1.5">
                                                                                                                                                                        <Activity className="h-4 w-4 text-emerald-400" />
                                                                                                                                                                        <div>
                                                                                                                                                                                                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                                                                                                                                                                                                                        Avg
                                                                                                                                                                                                                        Health
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="font-bold text-foreground">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                averageHealth
                                                                                                                                                                                                                        }

                                                                                                                                                                                                                        %
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="h-6 w-px bg-zinc-800" />
                                                                                                                                                <div className="flex items-center gap-1.5">
                                                                                                                                                                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                                                                                                                                                                        <div>
                                                                                                                                                                                                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                                                                                                                                                                                                                        Total
                                                                                                                                                                                                                        Alerts
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="font-bold text-foreground">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                activeAlertsCount
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                                <div className="h-6 w-px bg-zinc-800" />
                                                                                                                                                <div className="flex items-center gap-1.5">
                                                                                                                                                                        <ShieldAlert className="h-4 w-4 text-red-400" />
                                                                                                                                                                        <div>
                                                                                                                                                                                                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                                                                                                                                                                                                                        Outages
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="font-bold text-foreground text-red-400">
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                outageCount
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </header>

                                                                                                {/* Subheader Filters bar */}
                                                                                                <div className="border-b bg-card/50 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0">
                                                                                                                        <div className="flex flex-wrap items-center gap-4">
                                                                                                                                                {/* Toggle Scale */}
                                                                                                                                                <div className="flex items-center bg-zinc-950/60 p-0.5 rounded-lg border border-zinc-800">
                                                                                                                                                                        <Button
                                                                                                                                                                                                variant={
                                                                                                                                                                                                                        scale ===
                                                                                                                                                                                                                        13
                                                                                                                                                                                                                                                ? 'default'
                                                                                                                                                                                                                                                : 'ghost'
                                                                                                                                                                                                }
                                                                                                                                                                                                size="sm"
                                                                                                                                                                                                className="text-xs py-1"
                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                        setScale(
                                                                                                                                                                                                                                                13
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                        >
                                                                                                                                                                                                Core
                                                                                                                                                                                                (13
                                                                                                                                                                                                Repos)
                                                                                                                                                                        </Button>
                                                                                                                                                                        <Button
                                                                                                                                                                                                variant={
                                                                                                                                                                                                                        scale ===
                                                                                                                                                                                                                        300
                                                                                                                                                                                                                                                ? 'default'
                                                                                                                                                                                                                                                : 'ghost'
                                                                                                                                                                                                }
                                                                                                                                                                                                size="sm"
                                                                                                                                                                                                className="text-xs py-1"
                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                        setScale(
                                                                                                                                                                                                                                                300
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                        >
                                                                                                                                                                                                Netflix
                                                                                                                                                                                                Scale
                                                                                                                                                                                                (300
                                                                                                                                                                                                Repos)
                                                                                                                                                                        </Button>
                                                                                                                                                </div>

                                                                                                                                                {/* Edge filters */}
                                                                                                                                                <div className="flex items-center gap-3 text-xs bg-zinc-950/30 px-3 py-1.5 rounded-lg border border-zinc-900">
                                                                                                                                                                        <span className="text-muted-foreground font-semibold flex items-center gap-1">
                                                                                                                                                                                                <Filter className="h-3 w-3" />{' '}
                                                                                                                                                                                                Filters:
                                                                                                                                                                        </span>
                                                                                                                                                                        <label className="flex items-center gap-1.5 cursor-pointer text-purple-400 font-medium">
                                                                                                                                                                                                <input
                                                                                                                                                                                                                        type="checkbox"
                                                                                                                                                                                                                        checked={
                                                                                                                                                                                                                                                connectionFilters.api
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        onChange={(
                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                        ) =>
                                                                                                                                                                                                                                                setConnectionFilters(
                                                                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                                                                prev
                                                                                                                                                                                                                                                                        ) => ({
                                                                                                                                                                                                                                                                                                ...prev,
                                                                                                                                                                                                                                                                                                api: e
                                                                                                                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                                                                                                                        .checked,
                                                                                                                                                                                                                                                                        })
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="rounded border-zinc-800 bg-zinc-950 accent-purple-500 h-3.5 w-3.5"
                                                                                                                                                                                                />
                                                                                                                                                                                                HTTP/gRPC
                                                                                                                                                                                                APIs
                                                                                                                                                                        </label>
                                                                                                                                                                        <label className="flex items-center gap-1.5 cursor-pointer text-emerald-400 font-medium">
                                                                                                                                                                                                <input
                                                                                                                                                                                                                        type="checkbox"
                                                                                                                                                                                                                        checked={
                                                                                                                                                                                                                                                connectionFilters.event
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        onChange={(
                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                        ) =>
                                                                                                                                                                                                                                                setConnectionFilters(
                                                                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                                                                prev
                                                                                                                                                                                                                                                                        ) => ({
                                                                                                                                                                                                                                                                                                ...prev,
                                                                                                                                                                                                                                                                                                event: e
                                                                                                                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                                                                                                                        .checked,
                                                                                                                                                                                                                                                                        })
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="rounded border-zinc-800 bg-zinc-950 accent-emerald-500 h-3.5 w-3.5"
                                                                                                                                                                                                />
                                                                                                                                                                                                Kafka
                                                                                                                                                                                                Events
                                                                                                                                                                        </label>
                                                                                                                                                                        <label className="flex items-center gap-1.5 cursor-pointer text-yellow-400 font-medium">
                                                                                                                                                                                                <input
                                                                                                                                                                                                                        type="checkbox"
                                                                                                                                                                                                                        checked={
                                                                                                                                                                                                                                                connectionFilters.library
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        onChange={(
                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                        ) =>
                                                                                                                                                                                                                                                setConnectionFilters(
                                                                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                                                                prev
                                                                                                                                                                                                                                                                        ) => ({
                                                                                                                                                                                                                                                                                                ...prev,
                                                                                                                                                                                                                                                                                                library: e
                                                                                                                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                                                                                                                        .checked,
                                                                                                                                                                                                                                                                        })
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="rounded border-zinc-800 bg-zinc-950 accent-yellow-500 h-3.5 w-3.5"
                                                                                                                                                                                                />
                                                                                                                                                                                                Shared
                                                                                                                                                                                                Packages
                                                                                                                                                                        </label>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="flex items-center gap-2">
                                                                                                                                                {/* Search bar */}
                                                                                                                                                <form
                                                                                                                                                                        onSubmit={
                                                                                                                                                                                                handleSearchSubmit
                                                                                                                                                                        }
                                                                                                                                                                        className="relative"
                                                                                                                                                >
                                                                                                                                                                        <input
                                                                                                                                                                                                type="text"
                                                                                                                                                                                                placeholder="Search repositories..."
                                                                                                                                                                                                value={
                                                                                                                                                                                                                        searchQuery
                                                                                                                                                                                                }
                                                                                                                                                                                                onChange={(
                                                                                                                                                                                                                        e
                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                        setSearchQuery(
                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                                                                        .value
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                className="w-60 bg-zinc-950/80 border border-zinc-800 rounded-lg px-3.5 py-1.5 pl-9 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                                                                                                                                                                        />
                                                                                                                                                                        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                                                                                                                                </form>

                                                                                                                                                {/* Reset */}
                                                                                                                                                <Button
                                                                                                                                                                        variant="outline"
                                                                                                                                                                        size="sm"
                                                                                                                                                                        onClick={
                                                                                                                                                                                                handleReset
                                                                                                                                                                        }
                                                                                                                                                                        className="text-xs"
                                                                                                                                                                        title="Reset Graph Simulation"
                                                                                                                                                >
                                                                                                                                                                        <RotateCw className="h-3.5 w-3.5 mr-1" />
                                                                                                                                                                        Reset
                                                                                                                                                </Button>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* React Flow Container */}
                                                                                                <div className="flex-1 w-full bg-zinc-950 relative">
                                                                                                                        {loading ? (
                                                                                                                                                <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/50 backdrop-blur-sm z-10">
                                                                                                                                                                        <div className="flex flex-col items-center gap-3">
                                                                                                                                                                                                <RotateCw className="h-8 w-8 text-primary animate-spin" />
                                                                                                                                                                                                <span className="text-sm font-semibold text-muted-foreground">
                                                                                                                                                                                                                        Synthesizing
                                                                                                                                                                                                                        Topological
                                                                                                                                                                                                                        Map...
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        ) : null}

                                                                                                                        <ReactFlow
                                                                                                                                                nodes={
                                                                                                                                                                        nodes
                                                                                                                                                }
                                                                                                                                                edges={
                                                                                                                                                                        edges
                                                                                                                                                }
                                                                                                                                                onNodesChange={
                                                                                                                                                                        onNodesChange
                                                                                                                                                }
                                                                                                                                                onEdgesChange={
                                                                                                                                                                        onEdgesChange
                                                                                                                                                }
                                                                                                                                                onNodeClick={
                                                                                                                                                                        onNodeClick
                                                                                                                                                }
                                                                                                                                                nodeTypes={
                                                                                                                                                                        nodeTypes
                                                                                                                                                }
                                                                                                                                                fitView
                                                                                                                                                minZoom={
                                                                                                                                                                        0.05
                                                                                                                                                }
                                                                                                                                                maxZoom={
                                                                                                                                                                        1.5
                                                                                                                                                }
                                                                                                                        >
                                                                                                                                                <Background
                                                                                                                                                                        color="#27272a"
                                                                                                                                                                        gap={
                                                                                                                                                                                                24
                                                                                                                                                                        }
                                                                                                                                                                        size={
                                                                                                                                                                                                1
                                                                                                                                                                        }
                                                                                                                                                />
                                                                                                                                                <Controls className="!bg-zinc-900 !border-zinc-800 !text-white [&_button]:!bg-zinc-900 [&_button]:!border-zinc-800 [&_svg]:!fill-white hover:[&_button]:!bg-zinc-800" />
                                                                                                                                                <MiniMap
                                                                                                                                                                        className="!bg-zinc-900 !border-zinc-800"
                                                                                                                                                                        nodeColor={(
                                                                                                                                                                                                node
                                                                                                                                                                        ) => {
                                                                                                                                                                                                if (
                                                                                                                                                                                                                        node
                                                                                                                                                                                                                                                .data
                                                                                                                                                                                                                                                .isChaosSource
                                                                                                                                                                                                )
                                                                                                                                                                                                                        return '#ef4444';
                                                                                                                                                                                                if (
                                                                                                                                                                                                                        node
                                                                                                                                                                                                                                                .data
                                                                                                                                                                                                                                                .isChaosAffected
                                                                                                                                                                                                )
                                                                                                                                                                                                                        return '#f59e0b';
                                                                                                                                                                                                return '#3f3f46';
                                                                                                                                                                        }}
                                                                                                                                                                        maskColor="rgba(0, 0, 0, 0.7)"
                                                                                                                                                />
                                                                                                                        </ReactFlow>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Sidebar Details Drawer */}
                                                                        {selectedNode && (
                                                                                                <div className="w-80 border-l bg-card flex flex-col h-full overflow-hidden shrink-0 shadow-2xl transition-all duration-300">
                                                                                                                        <div className="p-4 border-b flex items-center justify-between shrink-0">
                                                                                                                                                <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5 font-mono">
                                                                                                                                                                        <Server className="h-4 w-4 text-primary" />
                                                                                                                                                                        {
                                                                                                                                                                                                selectedNode
                                                                                                                                                                                                                        .data
                                                                                                                                                                                                                        .name
                                                                                                                                                                        }
                                                                                                                                                </h3>
                                                                                                                                                <Button
                                                                                                                                                                        variant="ghost"
                                                                                                                                                                        size="icon"
                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                setSelectedNode(
                                                                                                                                                                                                                        null
                                                                                                                                                                                                )
                                                                                                                                                                        }
                                                                                                                                                                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                                                                                                                                >
                                                                                                                                                                        <X className="h-4 w-4" />
                                                                                                                                                </Button>
                                                                                                                        </div>

                                                                                                                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                                                                                                                                {/* Status alert panel */}
                                                                                                                                                {selectedNode
                                                                                                                                                                        .data
                                                                                                                                                                        .isChaosSource && (
                                                                                                                                                                        <div className="bg-red-950/20 border border-red-500/40 p-3 rounded-lg text-xs space-y-1 animate-pulse">
                                                                                                                                                                                                <div className="flex items-center gap-1 text-red-400 font-bold">
                                                                                                                                                                                                                        <ShieldAlert className="h-4 w-4" />
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                CRITICAL
                                                                                                                                                                                                                                                OUTAGE
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <p className="text-red-300/80">
                                                                                                                                                                                                                        This
                                                                                                                                                                                                                        repository
                                                                                                                                                                                                                        was
                                                                                                                                                                                                                        shut
                                                                                                                                                                                                                        down
                                                                                                                                                                                                                        manually
                                                                                                                                                                                                                        via
                                                                                                                                                                                                                        chaos
                                                                                                                                                                                                                        simulation.
                                                                                                                                                                                                                        Downstream
                                                                                                                                                                                                                        cascading
                                                                                                                                                                                                                        failovers
                                                                                                                                                                                                                        initiated.
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                )}
                                                                                                                                                {selectedNode
                                                                                                                                                                        .data
                                                                                                                                                                        .isChaosAffected &&
                                                                                                                                                                        !selectedNode
                                                                                                                                                                                                .data
                                                                                                                                                                                                .isChaosSource && (
                                                                                                                                                                                                <div className="bg-amber-950/20 border border-amber-500/30 p-3 rounded-lg text-xs space-y-1">
                                                                                                                                                                                                                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                                                                                                                                                                                                                                                <AlertTriangle className="h-4 w-4" />
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        DEPENDENCY
                                                                                                                                                                                                                                                                        OUTAGE
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <p className="text-amber-300/80">
                                                                                                                                                                                                                                                This
                                                                                                                                                                                                                                                repository
                                                                                                                                                                                                                                                is
                                                                                                                                                                                                                                                degraded
                                                                                                                                                                                                                                                because
                                                                                                                                                                                                                                                its
                                                                                                                                                                                                                                                upstream
                                                                                                                                                                                                                                                microservice
                                                                                                                                                                                                                                                dependency{' '}
                                                                                                                                                                                                                                                <span className="font-semibold text-amber-200 font-mono">
                                                                                                                                                                                                                                                                        @
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                chaosSourceId
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>{' '}
                                                                                                                                                                                                                                                is
                                                                                                                                                                                                                                                experiencing
                                                                                                                                                                                                                                                an
                                                                                                                                                                                                                                                outage.
                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )}

                                                                                                                                                {/* Git details */}
                                                                                                                                                <div className="space-y-2">
                                                                                                                                                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                                                                                                                                                                                Repository
                                                                                                                                                                                                Details
                                                                                                                                                                        </span>
                                                                                                                                                                        <div className="bg-zinc-950/40 border border-zinc-900 rounded-lg p-3 space-y-2 text-xs">
                                                                                                                                                                                                <div className="flex justify-between">
                                                                                                                                                                                                                        <span className="text-muted-foreground">
                                                                                                                                                                                                                                                Full
                                                                                                                                                                                                                                                Name:
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="font-semibold text-foreground font-mono truncate max-w-[150px]">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        selectedNode
                                                                                                                                                                                                                                                                                                .data
                                                                                                                                                                                                                                                                                                .name
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="flex justify-between">
                                                                                                                                                                                                                        <span className="text-muted-foreground">
                                                                                                                                                                                                                                                Language:
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="font-semibold text-foreground">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        selectedNode
                                                                                                                                                                                                                                                                                                .data
                                                                                                                                                                                                                                                                                                .primary_language
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="flex justify-between">
                                                                                                                                                                                                                        <span className="text-muted-foreground">
                                                                                                                                                                                                                                                Lines
                                                                                                                                                                                                                                                of
                                                                                                                                                                                                                                                Code:
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="font-semibold text-foreground font-mono">
                                                                                                                                                                                                                                                {selectedNode.data.lines_of_code.toLocaleString()}
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="flex justify-between">
                                                                                                                                                                                                                        <span className="text-muted-foreground">
                                                                                                                                                                                                                                                Cloning
                                                                                                                                                                                                                                                Origin:
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span
                                                                                                                                                                                                                                                className="font-semibold text-foreground text-[10px] truncate max-w-[120px]"
                                                                                                                                                                                                                                                title={
                                                                                                                                                                                                                                                                        selectedNode
                                                                                                                                                                                                                                                                                                .data
                                                                                                                                                                                                                                                                                                .clone_url
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        selectedNode
                                                                                                                                                                                                                                                                                                .data
                                                                                                                                                                                                                                                                                                .clone_url
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* Health indicators */}
                                                                                                                                                <div className="space-y-2">
                                                                                                                                                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                                                                                                                                                                                Architecture
                                                                                                                                                                                                Metrics
                                                                                                                                                                        </span>
                                                                                                                                                                        <div className="bg-zinc-950/40 border border-zinc-900 rounded-lg p-3 space-y-3 text-xs">
                                                                                                                                                                                                <div>
                                                                                                                                                                                                                        <div className="flex justify-between mb-1">
                                                                                                                                                                                                                                                <span className="text-muted-foreground">
                                                                                                                                                                                                                                                                        Test
                                                                                                                                                                                                                                                                        Coverage:
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="font-semibold text-foreground">
                                                                                                                                                                                                                                                                        {Math.round(
                                                                                                                                                                                                                                                                                                selectedNode
                                                                                                                                                                                                                                                                                                                        .data
                                                                                                                                                                                                                                                                                                                        .coverage *
                                                                                                                                                                                                                                                                                                                        100
                                                                                                                                                                                                                                                                        )}

                                                                                                                                                                                                                                                                        %
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                        className="bg-emerald-500 h-1.5 rounded-full"
                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                width: `${selectedNode.data.coverage * 100}%`,
                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="flex justify-between">
                                                                                                                                                                                                                        <span className="text-muted-foreground">
                                                                                                                                                                                                                                                Cyclomatic
                                                                                                                                                                                                                                                Complexity:
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span
                                                                                                                                                                                                                                                className={`font-semibold ${selectedNode.data.complexity > 250 ? 'text-amber-400' : 'text-foreground'}`}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        selectedNode
                                                                                                                                                                                                                                                                                                .data
                                                                                                                                                                                                                                                                                                .complexity
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="flex justify-between">
                                                                                                                                                                                                                        <span className="text-muted-foreground">
                                                                                                                                                                                                                                                Coupling
                                                                                                                                                                                                                                                Score:
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="font-semibold text-foreground">
                                                                                                                                                                                                                                                92%
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* Alert list */}
                                                                                                                                                {selectedNode
                                                                                                                                                                        .data
                                                                                                                                                                        .alerts
                                                                                                                                                                        .length >
                                                                                                                                                                        0 && (
                                                                                                                                                                        <div className="space-y-2">
                                                                                                                                                                                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                                                                                                                                                                                                        Active
                                                                                                                                                                                                                        Alerts
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <ul className="space-y-1.5">
                                                                                                                                                                                                                        {selectedNode.data.alerts.map(
                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                        alert: string,
                                                                                                                                                                                                                                                                        idx: number
                                                                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                                                                        <li
                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                className="bg-amber-950/10 border border-amber-900/30 rounded px-2.5 py-1.5 text-[11px] text-amber-300/80 flex items-start gap-1.5"
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                                                                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                alert
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </li>
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </ul>
                                                                                                                                                                        </div>
                                                                                                                                                )}
                                                                                                                        </div>

                                                                                                                        <div className="p-4 border-t bg-zinc-950/20 space-y-2 shrink-0">
                                                                                                                                                {/* Simulate chaos button */}
                                                                                                                                                <Button
                                                                                                                                                                        onClick={
                                                                                                                                                                                                triggerChaosSimulation
                                                                                                                                                                        }
                                                                                                                                                                        variant="destructive"
                                                                                                                                                                        className="w-full text-xs font-semibold py-2"
                                                                                                                                                                        disabled={
                                                                                                                                                                                                selectedNode
                                                                                                                                                                                                                        .data
                                                                                                                                                                                                                        .status ===
                                                                                                                                                                                                                        'outage' ||
                                                                                                                                                                                                selectedNode
                                                                                                                                                                                                                        .data
                                                                                                                                                                                                                        .isChaosSource
                                                                                                                                                                        }
                                                                                                                                                >
                                                                                                                                                                        <Zap className="h-4.5 w-4.5 mr-1 text-red-200 fill-red-200" />
                                                                                                                                                                        Simulate
                                                                                                                                                                        Outage
                                                                                                                                                                        (Chaos)
                                                                                                                                                </Button>

                                                                                                                                                {/* Open digital twin if real */}
                                                                                                                                                {!selectedNode
                                                                                                                                                                        .data
                                                                                                                                                                        .is_mock && (
                                                                                                                                                                        <Button
                                                                                                                                                                                                variant="outline"
                                                                                                                                                                                                className="w-full text-xs py-2"
                                                                                                                                                                                                onClick={() => {
                                                                                                                                                                                                                        window.location.href = `/software-city?repo=${selectedNode.id}`;
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                <Eye className="h-4 w-4 mr-1 text-primary" />
                                                                                                                                                                                                View
                                                                                                                                                                                                Software
                                                                                                                                                                                                City
                                                                                                                                                                                                twin
                                                                                                                                                                        </Button>
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}
                                                </div>
                        );
}
