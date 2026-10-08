'use client';

import React, { useState } from 'react';

export interface AutonomousSystemState {
  systemMode: 'AUTONOMOUS' | 'SEMI_AUTONOMOUS' | 'MANUAL_OVERRIDE';
  globalKillSwitch: boolean;
  activeAnomaliesCount: number;
  decisionsExecuted24h: number;
  remediationSuccessRate: number;
  modelDriftStatus: 'HEALTHY' | 'WARNING' | 'DRIFT_DETECTED';
}

export function AutonomousControlCenter() {
  const [state, setState] = useState<AutonomousSystemState>({
    systemMode: 'AUTONOMOUS',
    globalKillSwitch: false,
    activeAnomaliesCount: 3,
    decisionsExecuted24h: 1420,
    remediationSuccessRate: 99.4,
    modelDriftStatus: 'HEALTHY',
  });

  const toggleKillSwitch = () => {
    setState((prev) => ({
      ...prev,
      globalKillSwitch: !prev.globalKillSwitch,
      systemMode: !prev.globalKillSwitch ? 'MANUAL_OVERRIDE' : 'AUTONOMOUS',
    }));
  };

  const setMode = (mode: AutonomousSystemState['systemMode']) => {
    if (state.globalKillSwitch) return;
    setState((prev) => ({ ...prev, systemMode: mode }));
  };

  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-800 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-blue-400">
            Autonomous Ecosystem Control Center
          </h2>
          <p className="text-sm text-slate-400">
            Real-time closed-loop decision engine, guardrails & kill-switch management
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              state.globalKillSwitch
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}
          >
            {state.globalKillSwitch ? 'SYSTEM SHUTDOWN' : state.systemMode}
          </span>
          <button
            onClick={toggleKillSwitch}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
              state.globalKillSwitch
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
            }`}
          >
            {state.globalKillSwitch ? 'Re-enable Platform' : 'EMERGENCY KILL SWITCH'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/50">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Decisions (24h)
          </p>
          <p className="text-3xl font-extrabold text-blue-400 mt-1">
            {state.decisionsExecuted24h.toLocaleString()}
          </p>
          <span className="text-xs text-emerald-400 mt-1 inline-block">↑ 12.4% vs prev week</span>
        </div>

        <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/50">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Active Anomalies
          </p>
          <p className="text-3xl font-extrabold text-amber-400 mt-1">
            {state.activeAnomaliesCount}
          </p>
          <span className="text-xs text-amber-300 mt-1 inline-block">Auto-quarantine active</span>
        </div>

        <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/50">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Remediation Rate
          </p>
          <p className="text-3xl font-extrabold text-emerald-400 mt-1">
            {state.remediationSuccessRate}%
          </p>
          <span className="text-xs text-slate-400 mt-1 inline-block">Closed-loop verified</span>
        </div>

        <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/50">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Model Drift Health
          </p>
          <p className="text-xl font-bold text-emerald-400 mt-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            {state.modelDriftStatus}
          </p>
          <span className="text-xs text-slate-400 mt-1 inline-block">PSI: 0.042 (Normal)</span>
        </div>
      </div>

      <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-700/50 space-y-3">
        <h3 className="text-sm font-semibold text-slate-300">Operation Mode Governance</h3>
        <div className="flex gap-3">
          {(['AUTONOMOUS', 'SEMI_AUTONOMOUS', 'MANUAL_OVERRIDE'] as const).map((mode) => (
            <button
              key={mode}
              disabled={state.globalKillSwitch}
              onClick={() => setMode(mode)}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-all ${
                state.systemMode === mode
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              } ${state.globalKillSwitch ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {mode.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
