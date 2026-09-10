'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const DynamicChartWidget = dynamic(() => import('./RevenueChartWidget'), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full animate-pulse rounded-2xl bg-slate-900 flex items-center justify-center text-sm text-slate-400">
      Loading Analytics Dashboard...
    </div>
  ),
});

export const DynamicTrackingMap = dynamic(
  () => import('./booking/LiveTrackingMap').then((mod) => mod.LiveTrackingMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-80 w-full animate-pulse rounded-2xl bg-slate-950 flex items-center justify-center text-sm text-slate-500">
        Initializing Live Tracking Map...
      </div>
    ),
  },
);

export default function LazyDashboardWidget() {
  return (
    <div className="w-full space-y-4">
      <DynamicChartWidget />
    </div>
  );
}
