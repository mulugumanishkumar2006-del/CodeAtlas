'use client';

import React, { useMemo, useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ReactFlowProvider,
  useReactFlow,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { DependencyNodeComponent } from './dependency-custom-nodes';
import { AnimatedDependencyEdge } from './dependency-custom-edges';
import { DependencyNodeData, DependencyEdgeData } from './dependency-mock-data';
import {
  Focus,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  FlaskConical,
  Zap,
  Flame,
  Route
} from 'lucide-react';

const nodeTypes = {
  dependencyNode: DependencyNodeComponent,
};

const edgeTypes = {
  animatedDependencyEdge: AnimatedDependencyEdge,
};

interface DependencyGraphCanvasProps {
  nodesData: DependencyNodeData[];
  edgesData: DependencyEdgeData[];
  selectedNodeId: string | null;
  onSelectNode: (node: DependencyNodeData | null) => void;
  selectedEdgeId: string | null;
  onSelectEdge: (edge: DependencyEdgeData | null) => void;
  focusMode: boolean;
  onToggleFocusMode: () => void;
  currentView: string;
  searchQuery: string;
  shortestPathNodeIds: string[];
  onInvestigate: (nodeId: string) => void;
  onSimulate: (nodeId: string) => void;
  onOpenImpactReport: () => void;
}

function DependencyGraphCanvasInner({
  nodesData,
  edgesData,
  selectedNodeId,
  onSelectNode,
  selectedEdgeId,
  onSelectEdge,
  focusMode,
  currentView,
  searchQuery,
  shortestPathNodeIds,
  onInvestigate,
  onSimulate,
  onOpenImpactReport,
}: DependencyGraphCanvasProps) {
  const { fitView } = useReactFlow();

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    node: DependencyNodeData | null;
  } | null>(null);

  // Compute Layout Positions
  const { initialNodes, initialEdges } = useMemo(() => {
    let filtered = nodesData;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((n) =>
        n.name.toLowerCase().includes(q) ||
        n.type.toLowerCase().includes(q) ||
        n.technology.toLowerCase().includes(q)
      );
    }

    if (focusMode && selectedNodeId) {
      const connected = new Set<string>([selectedNodeId]);
      edgesData.forEach((edge) => {
        if (edge.source === selectedNodeId) connected.add(edge.target);
        if (edge.target === selectedNodeId) connected.add(edge.source);
      });
      filtered = filtered.filter((n) => connected.has(n.id));
    }

    const filteredIds = new Set(filtered.map((n) => n.id));

    const nodes: Node[] = filtered.map((node, index) => {
      let x = 100;
      let y = 100;

      if (currentView === 'Radial Graph') {
        const radius = index === 0 ? 0 : 380;
        const angle = (index / Math.max(1, filtered.length)) * 2 * Math.PI;
        x = 550 + radius * Math.cos(angle);
        y = 380 + radius * Math.sin(angle);
      } else if (currentView === 'Tree View') {
        x = (index % 4) * 360 + 100;
        y = Math.floor(index / 4) * 260 + 100;
      } else {
        // Layered default
        const layerOrder = ['Frontend', 'API Gateway', 'Microservice', 'Data Store', 'Messaging', 'Infrastructure', 'Library'];
        const colIndex = Math.max(0, layerOrder.indexOf(node.layer));
        const rowIndex = filtered.filter((n) => n.layer === node.layer).findIndex((n) => n.id === node.id);
        x = colIndex * 380 + 100;
        y = rowIndex * 240 + 100;
      }

      const isSelected = selectedNodeId === node.id;
      const isShortestPath = shortestPathNodeIds.includes(node.id);

      return {
        id: node.id,
        type: 'dependencyNode',
        position: { x, y },
        data: {
          node,
          isHighlighted: isSelected,
          isShortestPath,
        },
      };
    });

    const edges: Edge[] = edgesData
      .filter((edge) => filteredIds.has(edge.source) && filteredIds.has(edge.target))
      .map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'animatedDependencyEdge',
        selected: selectedEdgeId === edge.id,
        data: { edge },
      }));

    return { initialNodes: nodes, initialEdges: edges };
  }, [
    nodesData,
    edgesData,
    selectedNodeId,
    selectedEdgeId,
    focusMode,
    currentView,
    searchQuery,
    shortestPathNodeIds,
  ]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const found = nodesData.find((n) => n.id === node.id) || null;
      onSelectNode(found);
      onSelectEdge(null);
    },
    [nodesData, onSelectNode, onSelectEdge]
  );

  const handleEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      const found = edgesData.find((e) => e.id === edge.id) || null;
      onSelectEdge(found);
      onSelectNode(null);
    },
    [edgesData, onSelectEdge, onSelectNode]
  );

  const handleNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      const found = nodesData.find((n) => n.id === node.id) || null;
      setContextMenu({
        mouseX: event.clientX,
        mouseY: event.clientY,
        node: found,
      });
    },
    [nodesData]
  );

  const handlePaneClick = useCallback(() => {
    setContextMenu(null);
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden font-sans">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onNodeContextMenu={handleNodeContextMenu}
        onPaneClick={handlePaneClick}
        minZoom={0.2}
        maxZoom={2.5}
        defaultViewport={{ x: 50, y: 50, zoom: 0.85 }}
        fitView
      >
        <Background color="#1e293b" gap={24} size={1} />
        <Controls className="!bg-slate-900 !border-slate-800 !text-slate-300 rounded-2xl shadow-xl" />
        <MiniMap
          nodeColor={(node) => {
            const data = node.data?.node as DependencyNodeData | undefined;
            if (data?.status === 'Critical') return '#f43f5e';
            if (data?.status === 'Warning') return '#f59e0b';
            return '#38bdf8';
          }}
          maskColor="rgba(2, 6, 23, 0.85)"
          className="!bg-slate-950 !border-slate-800 rounded-2xl shadow-2xl !bottom-4 !right-4"
        />

        <Panel position="top-right" className="flex items-center gap-2">
          <button
            onClick={() => fitView({ duration: 400 })}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white backdrop-blur-md shadow-xl"
            title="Fit View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </Panel>
      </ReactFlow>

      {/* Context Menu */}
      {contextMenu && (
        <div
          style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
          className="fixed z-50 w-56 bg-slate-950/95 border border-slate-800 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl font-mono text-xs space-y-1 animate-in fade-in duration-100"
        >
          <div className="px-3 py-1 text-[10px] font-bold text-cyan-400 border-b border-slate-800/80 truncate">
            {contextMenu.node?.name}
          </div>
          <button
            onClick={() => {
              onSelectNode(contextMenu.node);
              onOpenImpactReport();
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-900 text-rose-300 font-bold flex items-center gap-2"
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" /> Calculate Blast Radius
          </button>
          <button
            onClick={() => {
              if (contextMenu.node) onInvestigate(contextMenu.node.id);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-900 text-slate-200 flex items-center gap-2"
          >
            <FlaskConical className="w-3.5 h-3.5 text-purple-400" /> Investigate Symbol
          </button>
          <button
            onClick={() => {
              if (contextMenu.node) onSimulate(contextMenu.node.id);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-900 text-slate-200 flex items-center gap-2"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Simulate Failure
          </button>
        </div>
      )}
    </div>
  );
}

export function DependencyGraphCanvas(props: DependencyGraphCanvasProps) {
  return (
    <ReactFlowProvider>
      <DependencyGraphCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
