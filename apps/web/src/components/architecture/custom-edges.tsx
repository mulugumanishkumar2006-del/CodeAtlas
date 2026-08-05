'use client';

import React from 'react';
import { getBezierPath, EdgeProps, BaseEdge, EdgeLabelRenderer } from '@xyflow/react';
import { ArchRelationship } from './architecture-mock-data';

export function AnimatedArchEdge({
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

  const rel = (data?.relationship || {}) as Partial<ArchRelationship>;
  const status = rel.status || 'Active';
  const protocol = rel.protocol || rel.type || 'Dependency';

  // Edge Styling based on Relationship Status & Type
  let strokeColor = '#38bdf8'; // Cyan default
  let strokeDash = 'none';
  let isViolating = false;

  if (status === 'Violating') {
    strokeColor = '#f43f5e'; // Rose/Red for architecture violations
    strokeDash = '6 6';
    isViolating = true;
  } else if (status === 'Degraded') {
    strokeColor = '#f59e0b'; // Amber warning
    strokeDash = '4 4';
  } else if (rel.type === 'Database Connections') {
    strokeColor = '#eab308'; // Yellow SQL
  } else if (rel.type === 'Message Queues' || rel.type === 'Event Flows') {
    strokeColor = '#c084fc'; // Purple Kafka
  } else if (rel.type === 'API Calls') {
    strokeColor = '#34d399'; // Emerald HTTP
  }

  return (
    <>
      {/* Background Glow Line */}
      <path
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={selected ? 5 : 3}
        strokeOpacity={selected ? 0.6 : 0.2}
      />

      {/* Main Flow Stroke */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth: selected ? 3 : 2,
          strokeDasharray: strokeDash,
        }}
      />

      {/* Animated Flow Particle (Dotted Pulse along path) */}
      <circle r={isViolating ? 4 : 3} fill={strokeColor} className="animate-pulse">
        <animateMotion dur={isViolating ? '1.5s' : '3s'} repeatCount="indefinite" path={edgePath} />
      </circle>

      {/* Protocol Label Renderer */}
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
            className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold shadow-lg border backdrop-blur-md transition-all ${
              isViolating
                ? 'bg-rose-950/90 text-rose-300 border-rose-500/60 animate-bounce'
                : selected
                ? 'bg-slate-900 text-cyan-300 border-cyan-400 scale-105'
                : 'bg-slate-950/90 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            {protocol}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
