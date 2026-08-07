'use client';

import React from 'react';
import { ForecastCenterWorkspace } from '@/components/forecast/forecast-center-workspace';

export default function ForecastPage() {
  return (
    <div className="-m-6 h-[calc(100vh-4rem)] overflow-hidden">
      <ForecastCenterWorkspace />
    </div>
  );
}
