import React, { useState } from 'react';

export interface AnomalyItem {
  id: string;
  metric: string;
  region: string;
  severity: 'HIGH' | 'CRITICAL' | 'MEDIUM';
  detectedAt: string;
}

export const DecisionIntelligenceDashboard: React.FC = () => {
  const [anomalies] = useState<AnomalyItem[]>([
    { id: 'anom-1', metric: 'SUPPLY_DEMAND_RATIO', region: 'US-EAST', severity: 'HIGH', detectedAt: '2 mins ago' },
    { id: 'anom-2', metric: 'CANCELLATION_SPIKE', region: 'EU-CENTRAL', severity: 'CRITICAL', detectedAt: '5 mins ago' },
  ]);

  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-800">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-blue-400">Autonomous Decision Intelligence</h2>
          <p className="text-sm text-slate-400">Real-time market state, anomaly detection & multi-agent swarm governance</p>
        </div>
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">
          Swarm Consensus Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <div className="text-sm text-slate-400">System Market Health</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">94.8%</div>
          <div className="text-xs text-slate-500 mt-1">Optimal liquidity across 14 regions</div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <div className="text-sm text-slate-400">Active Anomalies</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-1">{anomalies.length}</div>
          <div className="text-xs text-slate-500 mt-1">Auto-remediation triggers ready</div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <div className="text-sm text-slate-400">Autonomous Executions (24h)</div>
          <div className="text-3xl font-extrabold text-blue-400 mt-1">1,428</div>
          <div className="text-xs text-slate-500 mt-1">0 guardrail breaches</div>
        </div>
      </div>
    </div>
  );
};
