import React from 'react';

export interface SmartDeviceItem {
  id: string;
  name: string;
  type: string;
  isOnline: boolean;
  batteryPercentage?: number;
  lastSeen: string;
}

interface DeviceGridProps {
  devices: SmartDeviceItem[];
}

export function DeviceGrid({ devices }: DeviceGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {devices.map((device) => (
        <div key={device.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 dark:text-white">{device.name}</h4>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${device.isOnline ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
              {device.isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Type: {device.type}</p>
          {device.batteryPercentage !== undefined && (
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${device.batteryPercentage < 20 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${device.batteryPercentage}%` }}
              />
            </div>
          )}
          <p className="text-xs text-slate-400">Last Seen: {device.lastSeen}</p>
        </div>
      ))}
    </div>
  );
}
