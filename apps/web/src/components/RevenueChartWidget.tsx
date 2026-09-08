'use client';

import React from 'react';

export default function RevenueChartWidget() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Growth & Commission Breakdown</h3>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 p-4">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Gross Revenue</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">$45,280.00</p>
        </div>
        <div className="rounded-lg bg-green-50 dark:bg-green-950/40 p-4">
          <p className="text-xs font-medium text-green-600 dark:text-green-400">Provider Payouts</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">$40,752.00</p>
        </div>
        <div className="rounded-lg bg-purple-50 dark:bg-purple-950/40 p-4">
          <p className="text-xs font-medium text-purple-600 dark:text-purple-400">Platform Fees (10%)</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">$4,528.00</p>
        </div>
      </div>
    </div>
  );
}
