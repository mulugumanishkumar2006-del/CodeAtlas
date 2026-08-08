'use client';

import React from 'react';
import { EnterpriseSimulationStudio } from '@/components/simulation/enterprise-simulation-studio';

export default function SimulatePage() {
  return (
    <div className="-m-6 h-[calc(100vh-4rem)] overflow-hidden">
      <EnterpriseSimulationStudio />
    </div>
  );
}
