'use client';

import React, { useState, useEffect } from 'react';

export function StagingBanner() {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const env = process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV || 'staging';
  const isStagingOrDev = env === 'staging' || env === 'development';

  if (!mounted || !isStagingOrDev || dismissed) {
    return null;
  }

  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || 'v20.0.0-real-cloud-staging-operations';

  return (
    <div
      role="banner"
      aria-label="Staging Environment Indicator"
      className="bg-amber-500 text-amber-950 px-4 py-1.5 text-xs font-medium flex items-center justify-between shadow-sm border-b border-amber-600/30"
    >
      <div className="flex items-center gap-2 mx-auto sm:mx-0">
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-100 uppercase tracking-wide">
          {env}
        </span>
        <span>
          <strong>Staging Sandbox:</strong> Non-production test environment. Transactions and bookings are simulated ({appVersion}).
        </span>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="hidden sm:inline-flex text-amber-950/70 hover:text-amber-950 font-bold px-2 py-0.5 rounded text-xs transition-colors"
        aria-label="Dismiss staging banner"
      >
        Dismiss
      </button>
    </div>
  );
}
