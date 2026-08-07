'use client';

import React from 'react';
import { DocumentationWorkspace } from '@/components/documentation/documentation-workspace';

export default function DocumentationPage() {
  return (
    <div className="-m-6 h-[calc(100vh-4rem)] overflow-hidden">
      <DocumentationWorkspace />
    </div>
  );
}
