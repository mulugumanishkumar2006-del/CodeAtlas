'use client';

import React from 'react';
import { getBezierPath, EdgeProps, BaseEdge, EdgeLabelRenderer } from '@xyflow/react';
import { KnowledgeRelationship } from './knowledge-mock-data';

export function AnimatedKnowledgeEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const rel = (data?.relationship || {}) as Partial<KnowledgeRelationship>;
  const type = rel.type || 'References';

  let strokeColor = '#38bdf8'; // Cyan default
  let strokeDash = 'none';

  if (type === 'Writes' || type === 'Reads') strokeColor = '#eab308'; // Yellow Data
  else if (type === 'Publishes' || type === 'Subscribes') strokeColor = '#c084fc'; // Purple Kafka
  else if (type === 'Owns' || type === 'Documents') strokeColor = '#34d399'; // Emerald People/Docs
  else if (type === 'Deploys To') strokeColor = '#38bdf8'; // Sky Infra
  else if (type === 'Investigates' || type === 'Simulates') strokeColor = '#f43f5e'; // Rose AI

  return (
    <>
      {/* Background Glow */}
      <path
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={selected ? 5 : 3}
        strokeOpacity={selected ? 0.6 : 0.2}
      />

      {/* Main Edge Line */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth: selected ? 3 : 2,
          strokeDasharray: strokeDash,
        }}
      />

      {/* Animated Flow Particle */}
      <circle r={3} fill={strokeColor} className="animate-pulse">
        <animateMotion dur="2.5s" repeatCount="indefinite" path={edgePath} />
      </circle>

      {/* Relationship Type Label */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <div
            className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold shadow-lg border backdrop-blur-md transition-all cursor-pointer ${
              selected
                ? 'bg-slate-900 text-cyan-300 border-cyan-400 scale-105 shadow-cyan-950/50'
                : 'bg-slate-950/90 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            {type}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
