'use client';

import React from 'react';
import { CloudWorkspaceContainer } from '@/components/cloud-evolution/cloud-workspace-container';

export default function K8sPage() {
  return (
    <div className="-m-6 h-[calc(100vh-4rem)] overflow-hidden">
      <CloudWorkspaceContainer />
    </div>
  );
}
