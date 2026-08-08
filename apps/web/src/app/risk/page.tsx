'use client';

import React from 'react';
import { CrossOrgRiskStudio } from '@/components/risk/cross-org-risk-studio';

export default function RiskPage() {
  return (
    <div className="-m-6 h-[calc(100vh-4rem)] overflow-hidden">
      <CrossOrgRiskStudio />
    </div>
  );
}
