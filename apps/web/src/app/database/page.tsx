'use client';

import React from 'react';
import { DbWorkspaceContainer } from '@/components/database-migration/db-workspace-container';

export default function DatabasePage() {
  return (
    <div className="-m-6 h-[calc(100vh-4rem)] overflow-hidden">
      <DbWorkspaceContainer />
    </div>
  );
}
