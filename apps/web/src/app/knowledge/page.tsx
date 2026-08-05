'use client';

import React from 'react';
import { KnowledgeGraphWorkspace } from '@/components/knowledge/knowledge-graph-workspace';

export default function KnowledgePage() {
  return (
    <div className="-m-6 h-[calc(100vh-4rem)] overflow-hidden">
      <KnowledgeGraphWorkspace />
    </div>
  );
}
