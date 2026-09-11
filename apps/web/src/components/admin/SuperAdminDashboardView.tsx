'use client';

import React, { useState } from 'react';
import {
  Activity,
  DollarSign,
  Users,
  ShieldAlert,
  AlertTriangle,
  FileCheck,
  Ban,
  CheckCircle,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';

export interface AdminMetrics {
  liveUsersCount: number;
  activeBookingsCount: number;
  grossMerchandiseValue: number;
  platformNetRevenue: number;
  fraudAlertsCount: number;
  anomaliesDetected: string[];
}

interface SuperAdminDashboardViewProps {
  metrics?: AdminMetrics;
  onRefundTicket?: (ticketId: string, amount: number) => void;
  onSuspendProvider?: (providerId: string, reason: string) => void;
}

export const SuperAdminDashboardView: React.FC<SuperAdminDashboardViewProps> = ({
  metrics = {
    liveUsersCount: 342,
    activeBookingsCount: 28,
    grossMerchandiseValue: 148200,
    platformNetRevenue: 22230,
    fraudAlertsCount: 2,
    anomaliesDetected: [
      'Unusual surge in instant plumbing bookings in Downtown region',
      'Duplicate card attempt blocked for user #9102',
    ],
  },
  onRefundTicket,
  onSuspendProvider,
}) => {
  return (
    <div className="w-full space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Live Concurrent Users</span>
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold text-white">{metrics.liveUsersCount}</div>
          <div className="text-[11px] text-slate-500">{metrics.activeBookingsCount} active bookings right now</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Gross Merchandise Value</span>
            <DollarSign className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">${metrics.grossMerchandiseValue.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-400 font-semibold">Net Platform Comm: ${metrics.platformNetRevenue.toLocaleString()}</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Fraud Alerts</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400">{metrics.fraudAlertsCount}</div>
          <div className="text-[11px] text-slate-400">Risk flags require manual review</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>System Health</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">99.98%</div>
          <div className="text-[11px] text-slate-500">Kubernetes 8 node cluster operational</div>
        </div>
      </div>

      {/* AI Anomaly & Risk Alerts Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <span>AI Anomaly Detection Center</span>
        </h3>
        <div className="space-y-2">
          {metrics.anomaliesDetected.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-center justify-between"
            >
              <span>🚨 {item}</span>
              <button className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold hover:bg-amber-500/30">
                Inspect Trace
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
