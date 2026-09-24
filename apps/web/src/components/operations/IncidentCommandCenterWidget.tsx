import React from 'react';

interface IncidentCommandCenterWidgetProps {
  sev1Count: number;
  sev2Count: number;
  activeCommander: string;
}

export const IncidentCommandCenterWidget: React.FC<IncidentCommandCenterWidgetProps> = ({
  sev1Count,
  sev2Count,
  activeCommander,
}) => {
  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl shadow-lg space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-100">Incident Command Center</h3>
        <span className="px-2.5 py-1 text-xs font-semibold bg-red-950 text-red-400 border border-red-800 rounded-full">SEV RESPONSE READY</span>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-slate-800 rounded-lg">
          <p className="text-xs text-slate-400">SEV-1 Active</p>
          <p className="text-xl font-bold text-red-400">{sev1Count}</p>
        </div>
        <div className="p-3 bg-slate-800 rounded-lg">
          <p className="text-xs text-slate-400">SEV-2 Active</p>
          <p className="text-xl font-bold text-amber-400">{sev2Count}</p>
        </div>
        <div className="p-3 bg-slate-800 rounded-lg">
          <p className="text-xs text-slate-400">Commander</p>
          <p className="text-sm font-semibold text-sky-400 truncate">{activeCommander}</p>
        </div>
      </div>
    </div>
  );
};
