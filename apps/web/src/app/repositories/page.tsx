'use client';

import React from 'react';
import { MultiRepositoryWorkspaceView } from '@/components/workspace/multi-repository-workspace-view';

export default function RepositoriesWorkflowPage() {
  return (
    <div className="-m-6 h-[calc(100vh-4rem)] overflow-hidden">
      <MultiRepositoryWorkspaceView />
    </div>
  );
}
