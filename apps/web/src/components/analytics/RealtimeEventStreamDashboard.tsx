import React from 'react';

interface RealtimeEventStreamDashboardProps {
  eventsPerMinute: number;
  conversionRatePercent: string;
  grossMarketplaceVolumeUSD: number;
}

export const RealtimeEventStreamDashboard: React.FC<RealtimeEventStreamDashboardProps> = ({
  eventsPerMinute,
  conversionRatePercent,
  grossMarketplaceVolumeUSD,
}) => {
  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl shadow-lg space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-100">Live Event Streaming Funnel</h3>
        <span className="px-2 py-0.5 text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-md font-mono">STREAM ACTIVE</span>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-slate-800 rounded-lg">
          <p className="text-xs text-slate-400">Throughput</p>
          <p className="text-xl font-bold text-sky-400">{eventsPerMinute} EPM</p>
        </div>
        <div className="p-3 bg-slate-800 rounded-lg">
          <p className="text-xs text-slate-400">Conversion Rate</p>
          <p className="text-xl font-bold text-emerald-400">{conversionRatePercent}</p>
        </div>
        <div className="p-3 bg-slate-800 rounded-lg">
          <p className="text-xs text-slate-400">24h GMV</p>
          <p className="text-xl font-bold text-indigo-400">${grossMarketplaceVolumeUSD.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
