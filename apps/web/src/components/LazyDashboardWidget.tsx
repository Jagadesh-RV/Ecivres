'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const DynamicChartWidget = dynamic(() => import('./RevenueChartWidget'), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm text-gray-400">
      Loading Analytics Dashboard...
    </div>
  ),
});

export default function LazyDashboardWidget() {
  return (
    <div className="w-full">
      <DynamicChartWidget />
    </div>
  );
}
