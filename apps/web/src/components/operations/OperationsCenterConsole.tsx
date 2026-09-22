import React from 'react';

interface OperationsCenterConsoleProps {
  openIncidentsCount: number;
  slaCompliancePercent: string;
  queueStatus: string;
}

export const OperationsCenterConsole: React.FC<OperationsCenterConsoleProps> = ({
  openIncidentsCount,
  slaCompliancePercent,
  queueStatus,
}) => {
  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl shadow-lg space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-100">Marketplace Operations Command Center</h3>
        <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full">SYSTEMS NOMINAL</span>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-slate-800 rounded-lg">
          <p className="text-xs text-slate-400">Active Incidents</p>
          <p className="text-xl font-bold text-amber-400">{openIncidentsCount}</p>
        </div>
        <div className="p-3 bg-slate-800 rounded-lg">
          <p className="text-xs text-slate-400">SLA Compliance</p>
          <p className="text-xl font-bold text-emerald-400">{slaCompliancePercent}</p>
        </div>
        <div className="p-3 bg-slate-800 rounded-lg">
          <p className="text-xs text-slate-400">Queue Status</p>
          <p className="text-xl font-bold text-sky-400">{queueStatus}</p>
        </div>
      </div>
    </div>
  );
};
