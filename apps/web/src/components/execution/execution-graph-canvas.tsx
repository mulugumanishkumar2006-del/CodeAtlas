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

import { ExecutionNodeComponent } from './execution-custom-nodes';
import { AnimatedExecutionEdge } from './execution-custom-edges';
import { ExecutionStepData, ExecutionFlowTrace } from './execution-mock-data';
import {
  Maximize2,
  FlaskConical,
  Zap,
  Flame,
  Clock
} from 'lucide-react';

const nodeTypes = {
  executionNode: ExecutionNodeComponent,
};

const edgeTypes = {
  animatedExecutionEdge: AnimatedExecutionEdge,
};

interface ExecutionGraphCanvasProps {
  trace: ExecutionFlowTrace;
  currentStepIndex: number;
  onSelectStepIndex: (idx: number) => void;
  currentMode: string;
  searchQuery: string;
  latencyHeatmap: boolean;
  onSimulate: (stepId: string) => void;
  onOptimize: (stepId: string) => void;
}

function ExecutionGraphCanvasInner({
  trace,
  currentStepIndex,
  onSelectStepIndex,
  currentMode,
  searchQuery,
  latencyHeatmap,
  onSimulate,
  onOptimize,
}: ExecutionGraphCanvasProps) {
  const { fitView } = useReactFlow();

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    step: ExecutionStepData | null;
  } | null>(null);

  // Layout Nodes Sequentially (DevTools timeline flow style)
  const { initialNodes, initialEdges } = useMemo(() => {
    let steps = trace.steps;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      steps = steps.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q) ||
        s.technology.toLowerCase().includes(q)
      );
    }

    const activeStep = trace.steps[currentStepIndex];

    const nodes: Node[] = steps.map((step, index) => {
      // DevTools horizontal sequential trajectory
      const x = index * 340 + 100;
      const y = (index % 2 === 0 ? 120 : 280);

      const isSelected = activeStep?.id === step.id;

      return {
        id: step.id,
        type: 'executionNode',
        position: { x, y },
        data: {
          step,
          isActiveStep: isSelected,
        },
      };
    });

    const edges: Edge[] = [];
    for (let i = 0; i < steps.length - 1; i++) {
      const source = steps[i];
      const target = steps[i + 1];
      edges.push({
        id: `exec-edge-${source.id}-${target.id}`,
        source: source.id,
        target: target.id,
        type: 'animatedExecutionEdge',
        selected: activeStep?.id === source.id || activeStep?.id === target.id,
        data: {
          stepOrder: `${source.stepIndex} ➔ ${target.stepIndex}`,
        },
      });
    }

    return { initialNodes: nodes, initialEdges: edges };
  }, [trace.steps, currentStepIndex, searchQuery]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const idx = trace.steps.findIndex((s) => s.id === node.id);
      if (idx !== -1) onSelectStepIndex(idx);
    },
    [trace.steps, onSelectStepIndex]
  );

  const handleNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      const found = trace.steps.find((s) => s.id === node.id) || null;
      setContextMenu({
        mouseX: event.clientX,
        mouseY: event.clientY,
        step: found,
      });
    },
    [trace.steps]
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
        onNodeContextMenu={handleNodeContextMenu}
        onPaneClick={handlePaneClick}
        minZoom={0.2}
        maxZoom={2.5}
        defaultViewport={{ x: 50, y: 100, zoom: 0.85 }}
        fitView
      >
        <Background color="#1e293b" gap={24} size={1} />
        <Controls className="!bg-slate-900 !border-slate-800 !text-slate-300 rounded-2xl shadow-xl" />
        <MiniMap
          nodeColor={(node) => {
            const data = node.data?.step as ExecutionStepData | undefined;
            if ((data?.durationMs || 0) > 100) return '#f43f5e';
            if ((data?.durationMs || 0) > 25) return '#f59e0b';
            return '#38bdf8';
          }}
          maskColor="rgba(2, 6, 23, 0.85)"
          className="!bg-slate-950 !border-slate-800 rounded-2xl shadow-2xl !bottom-20 !right-4"
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
            Step #{contextMenu.step?.stepIndex}: {contextMenu.step?.name}
          </div>
          <button
            onClick={() => {
              if (contextMenu.step) onSimulate(contextMenu.step.id);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-900 text-purple-300 font-bold flex items-center gap-2"
          >
            <FlaskConical className="w-3.5 h-3.5 text-purple-400" /> Simulate Failure
          </button>
          <button
            onClick={() => {
              if (contextMenu.step) onOptimize(contextMenu.step.id);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-900 text-cyan-300 font-bold flex items-center gap-2"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" /> Optimize Step
          </button>
        </div>
      )}
    </div>
  );
}

export function ExecutionGraphCanvas(props: ExecutionGraphCanvasProps) {
  return (
    <ReactFlowProvider>
      <ExecutionGraphCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
