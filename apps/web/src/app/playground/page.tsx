'use client';

import React from 'react';
import { PlaygroundWorkspaceContainer } from '@/components/playground/playground-workspace-container';

export default function PlaygroundPage() {
  return (
    <div className="-m-6 h-[calc(100vh-4rem)] overflow-hidden">
      <PlaygroundWorkspaceContainer />
    </div>
  );
}
