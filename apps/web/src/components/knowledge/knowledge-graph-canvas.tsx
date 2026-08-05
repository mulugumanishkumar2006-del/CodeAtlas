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

import { KnowledgeNodeComponent } from './knowledge-custom-nodes';
import { AnimatedKnowledgeEdge } from './knowledge-custom-edges';
import { KnowledgeNodeData, KnowledgeRelationship } from './knowledge-mock-data';
import {
  Focus,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  FlaskConical,
  Zap,
  FileText
} from 'lucide-react';

const nodeTypes = {
  knowledgeNode: KnowledgeNodeComponent,
};

const edgeTypes = {
  animatedKnowledgeEdge: AnimatedKnowledgeEdge,
};

interface KnowledgeGraphCanvasProps {
  nodesData: KnowledgeNodeData[];
  relationshipsData: KnowledgeRelationship[];
  selectedNodeId: string | null;
  onSelectNode: (node: KnowledgeNodeData | null) => void;
  selectedRelationshipId: string | null;
  onSelectRelationship: (rel: KnowledgeRelationship | null) => void;
  focusMode: boolean;
  onToggleFocusMode: () => void;
  layoutEngine: 'radial' | 'hierarchical' | 'force-directed' | 'circular';
  selectedCategory: string;
  onInvestigate: (nodeId: string) => void;
  onSimulate: (nodeId: string) => void;
  onGenerateDocs: (nodeId: string) => void;
  highlightedNodeIds: string[];
}

function KnowledgeGraphCanvasInner({
  nodesData,
  relationshipsData,
  selectedNodeId,
  onSelectNode,
  selectedRelationshipId,
  onSelectRelationship,
  focusMode,
  layoutEngine,
  selectedCategory,
  onInvestigate,
  onSimulate,
  onGenerateDocs,
  highlightedNodeIds,
}: KnowledgeGraphCanvasProps) {
  const { fitView } = useReactFlow();

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    node: KnowledgeNodeData | null;
  } | null>(null);

  // Compute Layout Positions
  const { initialNodes, initialEdges } = useMemo(() => {
    let filtered = nodesData;

    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter((n) => n.category === selectedCategory);
    }

    if (focusMode && selectedNodeId) {
      const connected = new Set<string>([selectedNodeId]);
      relationshipsData.forEach((rel) => {
        if (rel.source === selectedNodeId) connected.add(rel.target);
        if (rel.target === selectedNodeId) connected.add(rel.source);
      });
      filtered = filtered.filter((n) => connected.has(n.id));
    }

    const filteredIds = new Set(filtered.map((n) => n.id));

    const nodes: Node[] = filtered.map((node, index) => {
      let x = 100;
      let y = 100;

      if (layoutEngine === 'radial') {
        // Neo4j Bloom Radial Layout
        const centerRadius = index === 0 ? 0 : 350 + Math.floor(index / 6) * 180;
        const angle = index === 0 ? 0 : (index / Math.max(1, filtered.length)) * 2 * Math.PI;
        x = 550 + centerRadius * Math.cos(angle);
        y = 380 + centerRadius * Math.sin(angle);
      } else if (layoutEngine === 'circular') {
        const radius = 450;
        const angle = (index / Math.max(1, filtered.length)) * 2 * Math.PI;
        x = 600 + radius * Math.cos(angle);
        y = 400 + radius * Math.sin(angle);
      } else if (layoutEngine === 'force-directed') {
        const cols = Math.ceil(Math.sqrt(filtered.length));
        x = (index % cols) * 360 + 100;
        y = Math.floor(index / cols) * 260 + 100;
      } else {
        // Hierarchical
        const catOrder = ['Code & Architecture', 'APIs & Data', 'Infrastructure & Ops', 'People & Governance', 'AI & Analytics'];
        const colIndex = Math.max(0, catOrder.indexOf(node.category));
        const rowIndex = filtered.filter((n) => n.category === node.category).findIndex((n) => n.id === node.id);
        x = colIndex * 380 + 100;
        y = rowIndex * 240 + 100;
      }

      const isSelected = selectedNodeId === node.id;
      const isHighlighted = highlightedNodeIds.includes(node.id);

      return {
        id: node.id,
        type: 'knowledgeNode',
        position: { x, y },
        data: {
          node,
          isHighlighted: isSelected || isHighlighted,
        },
      };
    });

    const edges: Edge[] = relationshipsData
      .filter((rel) => filteredIds.has(rel.source) && filteredIds.has(rel.target))
      .map((rel) => ({
        id: rel.id,
        source: rel.source,
        target: rel.target,
        type: 'animatedKnowledgeEdge',
        selected: selectedRelationshipId === rel.id,
        data: { relationship: rel },
      }));

    return { initialNodes: nodes, initialEdges: edges };
  }, [
    nodesData,
    relationshipsData,
    selectedNodeId,
    selectedRelationshipId,
    focusMode,
    layoutEngine,
    selectedCategory,
    highlightedNodeIds,
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
      onSelectRelationship(null);
    },
    [nodesData, onSelectNode, onSelectRelationship]
  );

  const handleEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      const found = relationshipsData.find((r) => r.id === edge.id) || null;
      onSelectRelationship(found);
      onSelectNode(null);
    },
    [relationshipsData, onSelectRelationship, onSelectNode]
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
            const data = node.data?.node as KnowledgeNodeData | undefined;
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

      {/* Right Click Context Menu */}
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
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-900 text-slate-200 flex items-center gap-2"
          >
            <Focus className="w-3.5 h-3.5 text-cyan-400" /> Focus Artifact Node
          </button>
          <button
            onClick={() => {
              if (contextMenu.node) onInvestigate(contextMenu.node.id);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-900 text-slate-200 flex items-center gap-2"
          >
            <FlaskConical className="w-3.5 h-3.5 text-purple-400" /> Investigate Entity
          </button>
          <button
            onClick={() => {
              if (contextMenu.node) onSimulate(contextMenu.node.id);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-900 text-slate-200 flex items-center gap-2"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Simulate Impact
          </button>
        </div>
      )}
    </div>
  );
}

export function KnowledgeGraphCanvas(props: KnowledgeGraphCanvasProps) {
  return (
    <ReactFlowProvider>
      <KnowledgeGraphCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
