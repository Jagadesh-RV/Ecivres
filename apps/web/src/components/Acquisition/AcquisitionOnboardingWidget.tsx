'use client';

import React from 'react';

interface AcquisitionWidgetProps {
  scorePercent: number;
  utmCampaign?: string;
}

export const AcquisitionOnboardingWidget: React.FC<AcquisitionWidgetProps> = ({ scorePercent, utmCampaign }) => {
  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-white shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-indigo-400">Account Activation Progress</h3>
        <span className="text-xs font-mono text-emerald-400">{scorePercent}% Complete</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2 mb-3">
        <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full transition-all duration-300" style={{ width: `${scorePercent}%` }} />
      </div>
      {utmCampaign && (
        <p className="text-xs text-slate-400">
          Campaign: <span className="text-slate-200 font-medium">{utmCampaign}</span>
        </p>
      )}
    </div>
  );
};
