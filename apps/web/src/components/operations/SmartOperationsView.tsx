'use client';

import React from 'react';
import { Activity, AlertTriangle, ShieldCheck, CheckCircle2, Clock, Zap } from 'lucide-react';

export interface SlaItem {
  serviceName: string;
  uptimePercentage: number;
  p99LatencyMs: number;
  errorBudgetRemainingPercentage: number;
  status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
}

interface SmartOperationsViewProps {
  services?: SlaItem[];
}

export const SmartOperationsView: React.FC<SmartOperationsViewProps> = ({
  services = [
    { serviceName: 'Core Booking Engine API', uptimePercentage: 99.99, p99LatencyMs: 142, errorBudgetRemainingPercentage: 94.2, status: 'HEALTHY' },
    { serviceName: 'Realtime Socket.IO Gateway', uptimePercentage: 99.95, p99LatencyMs: 85, errorBudgetRemainingPercentage: 88.0, status: 'HEALTHY' },
    { serviceName: 'Stripe Payment Webhook Worker', uptimePercentage: 100.0, p99LatencyMs: 210, errorBudgetRemainingPercentage: 100.0, status: 'HEALTHY' },
  ],
}) => {
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Service Health & Error Budget Center</span>
          </div>
          <h2 className="text-2xl font-bold">SLO / SLA Operational Monitoring</h2>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>All Microservices Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((s, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white">{s.serviceName}</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                {s.status}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-extrabold text-white">{s.uptimePercentage}% Uptime</div>
              <div className="text-[11px] text-indigo-400 font-semibold">P99 Latency: {s.p99LatencyMs} ms</div>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-800">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Error Budget Remaining</span>
                <span className="font-bold text-white">{s.errorBudgetRemainingPercentage}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-400"
                  style={{ width: `${s.errorBudgetRemainingPercentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
