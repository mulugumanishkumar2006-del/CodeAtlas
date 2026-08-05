'use client';

import React from 'react';
import { SemanticSearchStudio } from '@/components/search/semantic-search-studio';

export default function SearchWorkflowPage() {
  return (
    <div className="-m-6 h-[calc(100vh-4rem)] overflow-hidden">
      <SemanticSearchStudio />
    </div>
  );
}
