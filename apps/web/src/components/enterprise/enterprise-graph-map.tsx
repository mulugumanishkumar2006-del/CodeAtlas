'use client';

import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export function EnterpriseGraphMap() {
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [
      { id: 'org-root', type: 'default', position: { x: 300, y: 50 }, data: { label: '🏢 Acme Global Enterprise (1,042 Repos)' }, style: { background: '#020617', border: '2px solid #38bdf8', color: '#fff', borderRadius: '16px', padding: '12px', fontWeight: 'bold' } },
      { id: 'dom-core', type: 'default', position: { x: 100, y: 200 }, data: { label: '⚡ Core Platform (420 Repos)' }, style: { background: '#090d16', border: '1px solid #10b981', color: '#34d399', borderRadius: '12px', padding: '10px' } },
      { id: 'dom-pay', type: 'default', position: { x: 500, y: 200 }, data: { label: '💳 Payments Guild (85 Repos)' }, style: { background: '#090d16', border: '1px solid #f43f5e', color: '#fb7185', borderRadius: '12px', padding: '10px' } },
      { id: 'svc-kong', type: 'default', position: { x: 100, y: 350 }, data: { label: 'Kong API Gateway (v3.4)' }, style: { background: '#0f172a', border: '1px solid #38bdf8', color: '#38bdf8', borderRadius: '10px' } },
      { id: 'svc-payment', type: 'default', position: { x: 500, y: 350 }, data: { label: 'Payment Microservice (svc-payment)' }, style: { background: '#0f172a', border: '1px solid #fb7185', color: '#fb7185', borderRadius: '10px' } },
      { id: 'db-postgres', type: 'default', position: { x: 300, y: 480 }, data: { label: '🗄️ PostgreSQL Subscriptions DB' }, style: { background: '#0f172a', border: '1px solid #f59e0b', color: '#fbbf24', borderRadius: '10px' } }
    ];

    const edges: Edge[] = [
      { id: 'e1', source: 'org-root', target: 'dom-core', animated: true, style: { stroke: '#38bdf8' } },
      { id: 'e2', source: 'org-root', target: 'dom-pay', animated: true, style: { stroke: '#f43f5e' } },
      { id: 'e3', source: 'dom-core', target: 'svc-kong', animated: true },
      { id: 'e4', source: 'dom-pay', target: 'svc-payment', animated: true },
      { id: 'e5', source: 'svc-payment', target: 'db-postgres', animated: true, style: { stroke: '#f59e0b' } }
    ];

    return { initialNodes: nodes, initialEdges: edges };
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden font-sans">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          defaultViewport={{ x: 50, y: 50, zoom: 0.85 }}
          fitView
        >
          <Background color="#1e293b" gap={24} size={1} />
          <Controls className="!bg-slate-900 !border-slate-800 !text-slate-300 rounded-2xl shadow-xl" />
          <MiniMap maskColor="rgba(2, 6, 23, 0.85)" className="!bg-slate-950 !border-slate-800 rounded-2xl shadow-2xl !bottom-4 !right-4" />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
