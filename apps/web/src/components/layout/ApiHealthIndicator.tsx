'use client';

import React, { useEffect, useState } from 'react';

type BackendStatus = 'checking' | 'healthy' | 'degraded' | 'offline';

export function ApiHealthIndicator() {
  const [status, setStatus] = useState<BackendStatus>('checking');
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkHealth() {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const start = Date.now();
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const res = await fetch(`${apiUrl}/api/v1/health/live`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        clearTimeout(timeoutId);

        if (isMounted) {
          const duration = Date.now() - start;
          setLatency(duration);
          if (res.ok) {
            setStatus('healthy');
          } else {
            setStatus('degraded');
          }
        }
      } catch {
        if (isMounted) {
          setStatus('offline');
          setLatency(null);
        }
      }
    }

    checkHealth();
    const interval = setInterval(checkHealth, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Only display in development and staging environments
  const env = process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV || 'staging';
  if (env === 'production' || status === 'healthy' || status === 'checking') {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 bg-rose-900/90 text-white text-xs px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm border border-rose-700 flex items-center gap-2"
    >
      <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse inline-block" />
      <span>
        {status === 'offline'
          ? 'Backend API currently offline. Retrying...'
          : `Backend degraded${latency ? ` (${latency}ms)` : ''}`}
      </span>
    </div>
  );
}
