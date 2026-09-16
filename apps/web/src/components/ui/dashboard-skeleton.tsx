import React from 'react';

export function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-6">
      <div className="h-8 w-1/3 bg-slate-200 dark:bg-slate-700 rounded-md" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl p-4 space-y-3">
            <div className="h-4 w-1/2 bg-slate-300 dark:bg-slate-600 rounded" />
            <div className="h-8 w-1/4 bg-slate-300 dark:bg-slate-600 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
