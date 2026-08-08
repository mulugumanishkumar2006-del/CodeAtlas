'use client';

import React from 'react';
import { OrgKnowledgeGraphStudio } from '@/components/knowledge-graph/org-knowledge-graph-studio';

export default function KnowledgePage() {
  return (
    <div className="-m-6 h-[calc(100vh-4rem)] overflow-hidden">
      <OrgKnowledgeGraphStudio />
    </div>
  );
}
