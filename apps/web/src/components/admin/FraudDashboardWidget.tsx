import React from 'react';

interface FraudDashboardWidgetProps {
  totalIncidentsCount: number;
  highRiskUsersCount: number;
  anomalyRatePercent: string;
}

export const FraudDashboardWidget: React.FC<FraudDashboardWidgetProps> = ({
  totalIncidentsCount,
  highRiskUsersCount,
  anomalyRatePercent,
}) => {
  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl shadow-lg space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-100">Fraud Intelligence Radar</h3>
        <span className="px-2.5 py-1 text-xs font-semibold bg-red-950 text-red-400 border border-red-800 rounded-full">ACTIVE MONITORING</span>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-slate-800 rounded-lg">
          <p className="text-xs text-slate-400">Total Flagged</p>
          <p className="text-xl font-bold text-red-400">{totalIncidentsCount}</p>
        </div>
        <div className="p-3 bg-slate-800 rounded-lg">
          <p className="text-xs text-slate-400">High Risk Accounts</p>
          <p className="text-xl font-bold text-amber-400">{highRiskUsersCount}</p>
        </div>
        <div className="p-3 bg-slate-800 rounded-lg">
          <p className="text-xs text-slate-400">Payment Anomaly</p>
          <p className="text-xl font-bold text-emerald-400">{anomalyRatePercent}</p>
        </div>
      </div>
    </div>
  );
};
