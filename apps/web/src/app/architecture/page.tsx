'use client';

import React from 'react';
import { ArchitectureExplorer } from '@/components/architecture/architecture-explorer';

export default function ArchitecturePage() {
  return (
    <div className="-m-6 h-[calc(100vh-4rem)] overflow-hidden">
      <ArchitectureExplorer />
    </div>
  );
}
